use actix_web::web;

use crate::resort::{handlers};

pub fn routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/resorts")
            .service(
                web::resource("")
                    .route(web::get().to(handlers::get_by_id))
                    .route(web::post().to(handlers::create)),
            )
    );
}
