use actix_web::{web, HttpResponse, Responder};
use bson::{doc};
use futures::stream::StreamExt;
use mongodb::{options::FindOptions, Client};
use std::sync::Mutex;

use crate::resort::model::{Resort};

const MONGO_DB: &'static str = "ski-rust";
const MONGO_COLL_LOGS: &'static str = "resorts";

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::resource("/resorts")
            .route(web::get().to(get_resorts))
            .route(web::post().to(add_resort)),
    );
}

async fn get_resorts(data: web::Data<Mutex<Client>>) -> impl Responder {
    let resorts_collection = data
        .lock()
        .unwrap()
        .database(MONGO_DB)
        .collection(MONGO_COLL_LOGS);

    let filter = doc! {};
    let find_options = FindOptions::builder().sort(doc! { "_id": -1}).build();
    let mut cursor = resorts_collection.find(filter, find_options).await.unwrap();

    let mut results = Vec::new();
    while let Some(result) = cursor.next().await {
        match result {
            Ok(document) => {
                results.push(document);
            }
            _ => {
                return HttpResponse::InternalServerError().finish();
            }
        }
    }
    HttpResponse::Ok().json(results)
}

async fn add_resort() -> impl Responder {
    format!("Not yet implemented!")
}

// pub async fn get_by_id() -> Result<HttpResponse, Error> {
//     Ok(HttpResponse::Ok().body("Hello world!"))
// }

// pub async fn create(_resort: web::Json<Resort>) -> Result<HttpResponse, Error> {
//     Ok(HttpResponse::Ok().body("created!"))
// }