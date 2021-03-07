use actix_web::{web, HttpResponse, Responder};
use bson::{doc, Bson};
use futures::stream::StreamExt;
use mongodb::{options::FindOptions, Client};
use std::sync::Mutex;
use chrono::Utc;
use crate::resort::model::{Resort, NewResort};

const MONGO_DB: &'static str = "ski-rust";
const MONGO_COLL_RESORTS: &'static str = "resorts";

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/resorts")
            .route(web::get().to(get_resorts))
            .route(web::post().to(add_resort))
            .route(web::delete().to(delete_resort)),
        
    );
}

async fn get_resorts(data: web::Data<Mutex<Client>>) -> impl Responder {
    let resorts_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_RESORTS);

    let filter = doc! {};
    let find_options = FindOptions::builder().sort(doc! { "_id": -1}).build();
    let mut cursor = resorts_collection.find(filter, find_options).await.unwrap();

    let mut results = Vec::new();
    while let Some(result) = cursor.next().await {
        match result {
            Ok(document) => {
                let resort: Resort = bson::from_bson(Bson::Document(document)).unwrap();
                results.push(resort);
            }
            _ => {
                return HttpResponse::InternalServerError().finish();
            }
        }
    }
    HttpResponse::Ok().json(results)
}

async fn add_resort(data: web::Data<Mutex<Client>>, new_resort: web::Json<NewResort>) -> impl Responder {
    let resort_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_RESORTS);

    let doc = doc! { "name": &new_resort.name, "createdOn": Bson::DateTime(Utc::now()) };

    match resort_collection.insert_one(doc, None).await {
        Ok(db_result) => {
            if let Some(new_id) = db_result.inserted_id.as_object_id() {
                println!("New document inserted with id {}", new_id);   
            }
            return HttpResponse::Created().json(db_result.inserted_id)
        }
        Err(err) =>
        {
            println!("Failed! {}", err);
            return HttpResponse::InternalServerError().finish()
        }
    }
}

async fn delete_resort(data: web::Data<Mutex<Client>>, web::Path(id): web::Path<String>) -> impl Responder {
    println!("body: {}", id);
    let resorts_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_RESORTS);

    let filter = doc! { "_id": id};
    match resorts_collection.delete_one(filter, None).await {
        Ok(_) => {
            HttpResponse::Ok().json(true)
        },
        Err(err) => {
            println!("{}", err);
            HttpResponse::NotFound().json(false)
        }
    }
}
