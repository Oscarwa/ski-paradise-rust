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
            .route(web::post().to(add_resort)),
    )
    .service(
        web::resource("/resorts/{id}")
            .route(web::delete().to(delete_resort))
            .route(web::patch().to(update_resort))
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
    if &new_resort.name == "" {
        return HttpResponse::BadRequest().json("Resort name missing")
    }

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
            println!("add_resort failed! {}", err);
            return HttpResponse::InternalServerError().finish()
        }
    }
}

async fn delete_resort(data: web::Data<Mutex<Client>>, web::Path(id): web::Path<String>) -> impl Responder {
    let resorts_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_RESORTS);

    let filter = doc! { "_id": bson::oid::ObjectId::with_string(&id.to_string()).unwrap() };
    match resorts_collection.find_one_and_delete(filter.clone(), None).await {
        Ok(deleted_result) => {
            match deleted_result {
                Some(deleted) => {
                    let deleted_doc: Result<Resort, _> = bson::from_bson(Bson::Document(deleted));
                    match deleted_doc {
                        Ok(_del) => HttpResponse::Ok().json(true),
                        Err(_) => HttpResponse::NotFound().json(false)
                    }
                },
                None => {
                    HttpResponse::NotFound().json(false)
                }
            }
        },
        Err(err) => {
            println!("delete_resort failed! {}", err);
            HttpResponse::NotFound().json(false)
        }
    }
}

async fn update_resort(data: web::Data<Mutex<Client>>, web::Path(id): web::Path<String>, resort: web::Json<NewResort>) -> impl Responder {
    if &resort.name == "" {
        return HttpResponse::BadRequest().json("Resort name missing")
    }

    let resorts_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_RESORTS);

    let update = doc! { "name": &resort.name };
    let filter = doc! { "_id": bson::oid::ObjectId::with_string(&id.to_string()).unwrap() };
    match resorts_collection.update_one(filter.clone(), update, None).await {
        Ok(result) => {
            HttpResponse::Ok().json(result.modified_count == 1)
        },
        Err(err) => {
            println!("update_resort failed! {}", err);
            HttpResponse::NotFound().json(false)
        }
    }
}
