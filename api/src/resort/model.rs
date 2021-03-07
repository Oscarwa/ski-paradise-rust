use bson::{oid::ObjectId};
use serde::{Serialize, Deserialize};

#[derive(Deserialize, Serialize)]
pub struct Resort {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub name: String
}

#[derive(Deserialize, Serialize)]
pub struct NewResort {
    pub name: String
}