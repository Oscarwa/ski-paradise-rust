use actix_web::{web, Error, HttpResponse};

use crate::resort::model::{Resort};

pub async fn get_by_id() -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().body("Hello world!"))
}

pub async fn create(_resort: web::Json<Resort>) -> Result<HttpResponse, Error> {
    Ok(HttpResponse::Ok().body("created!"))
}