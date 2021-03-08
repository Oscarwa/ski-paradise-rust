use actix_web::{web, HttpResponse, Responder};
use bson::{doc, Bson};
use futures::stream::StreamExt;
use mongodb::{options::FindOptions, Client};
use std::sync::Mutex;
use chrono::Utc;
use crate::user::model::{User, NewUser};

const MONGO_DB: &'static str = "ski-rust";
const MONGO_COLL_USERS: &'static str = "users";

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/users")
            .route(web::get().to(get_users))
            .route(web::post().to(add_user)),
    );
}

async fn get_users(data: web::Data<Mutex<Client>>) -> impl Responder {
    let users_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_USERS);

    let filter = doc! {};
    let find_options = FindOptions::builder().sort(doc! { "_id": -1}).build();
    let mut cursor = users_collection.find(filter, find_options).await.unwrap();

    let mut results = Vec::new();
    while let Some(result) = cursor.next().await {
        match result {
            Ok(document) => {
                let resort: User = bson::from_bson(Bson::Document(document)).unwrap();
                results.push(resort);
            }
            Err(err) => {
                println!("get_users failed! {}", err);
                return HttpResponse::InternalServerError().finish();
            }
        }
    }
    HttpResponse::Ok().json(results)
}

async fn add_user(data: web::Data<Mutex<Client>>, new_user: web::Json<NewUser>) -> impl Responder {
    if &new_user.first_name == "" {
        return HttpResponse::BadRequest().json("First name missing")
    }
    if &new_user.last_name == "" {
        return HttpResponse::BadRequest().json("Last name missing")
    }
    if &new_user.email == "" {
        return HttpResponse::BadRequest().json("Email missing")
    }
    
    let users_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_USERS);

    let doc = doc! { 
        "first_name": &new_user.first_name, 
        "last_name": &new_user.last_name,
        "email": &new_user.email,
        "fav_resort": &new_user.fav_resort,
        "createdOn": Bson::DateTime(Utc::now()) 
    };

    match users_collection.insert_one(doc, None).await {
        Ok(db_result) => {
            if let Some(new_id) = db_result.inserted_id.as_object_id() {
                println!("New document inserted with id {}", new_id);   
            }
            return HttpResponse::Created().json(db_result.inserted_id)
        }
        Err(err) =>
        {
            println!("add_user failed! {}", err);
            return HttpResponse::InternalServerError().finish()
        }
    }
}
