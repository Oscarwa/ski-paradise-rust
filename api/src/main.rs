
extern crate dotenv;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use mongodb::{options::ClientOptions, Client};
use mongodb::options::{Credential, AuthMechanism};
use std::sync::*;
use dotenv::dotenv;
use api::resort;
use api::user;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let uri = dotenv::var("MONGODB_URI").expect("MONGODB_URI not configured!");
    let mut client_options = ClientOptions::parse(&uri).await.unwrap();

    let user = dotenv::var("MONGODB_USER").expect("MONGODB_USER not configured!");
    let pwd = dotenv::var("MONGODB_PWD").expect("MONGODB_PWD not configured!");
    client_options.credential = Some(Credential::builder()
        .username(user)
        .password(pwd)
        .mechanism(AuthMechanism::ScramSha1)
        .build()
    );

    let client = web::Data::new(Mutex::new(Client::with_options(client_options).unwrap()));

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::default()
                .allow_any_origin()
                .allow_any_method()
                .allow_any_header()
            )
            .app_data(client.clone())
            .service(
                web::scope("/api")
                    .configure(resort::handlers::routes)
                    .configure(user::handlers::routes)
            )
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}