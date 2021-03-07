
extern crate dotenv;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use mongodb::{options::ClientOptions, Client};
use mongodb::options::{Credential, AuthMechanism};
use std::sync::*;
use dotenv::dotenv;
use api::resort;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    // let uri = dotenv::var("MONGODB_URI");
    let mut client_options = ClientOptions::parse("mongodb+srv://ski-user:VBOHlj82dcUVQzJp@cluster0.xex8j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority").await.unwrap();
    client_options.app_name = Some("ski-api".to_string());
    client_options.credential = Some(Credential::builder().username("admin".to_string()).password("admin".to_string()).mechanism(AuthMechanism::ScramSha1).build());
    let client = web::Data::new(Mutex::new(Client::with_options(client_options).unwrap()));

    HttpServer::new(move || {
        App::new()
            .wrap(Cors::default().allowed_origin("http://localhost:3000"))
            .app_data(client.clone())
            .service(web::scope("/api").configure(resort::handlers::routes))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}