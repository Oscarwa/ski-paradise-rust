use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize)]
pub struct Resort {
    id: Option<i32>,
    name: Option<String>,
}