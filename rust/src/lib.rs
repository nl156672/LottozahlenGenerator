use wasm_bindgen::prelude::*;
use std::collections::BTreeSet;

#[wasm_bindgen]
pub fn generate_lotto() -> js_sys::Array {
    let mut set = BTreeSet::new();
    while set.len() < 6 {
        let r = ((js_sys::Math::random() * 49.0).floor() as u32) + 1;
        set.insert(r);
    }
    let superzahl = ((js_sys::Math::random() * 10.0).floor() as u32);
    let arr = js_sys::Array::new();
    for n in set.iter() {
        arr.push(&JsValue::from(*n));
    }
    arr.push(&JsValue::from(superzahl));
    arr
}

// Small helper: generate a reproducible pseudo-random seed from JS (optional)
#[wasm_bindgen]
pub fn wasm_available() -> bool {
    true
}
