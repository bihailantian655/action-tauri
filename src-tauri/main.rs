#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;

#[derive(Serialize, Deserialize)]
struct DirEntry {
    name: String,
    is_dir: bool,
}

#[tauri::command]
fn read_dir(path: String) -> Result<Vec<DirEntry>, String> {
    let dir_path = Path::new(&path);
    
    if !dir_path.exists() {
        return Err(format!("路径不存在: {}", path));
    }
    
    if !dir_path.is_dir() {
        return Err(format!("不是文件夹: {}", path));
    }
    
    let entries = fs::read_dir(dir_path)
        .map_err(|e| format!("读取文件夹失败: {}", e))?;
    
    let mut result = Vec::new();
    
    for entry in entries {
        if let Ok(entry) = entry {
            let name = entry.file_name().to_string_lossy().to_string();
            let is_dir = entry.path().is_dir();
            result.push(DirEntry { name, is_dir });
        }
    }
    
    Ok(result)
}

#[tauri::command]
fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("读取文件失败: {}", e))
}

#[tauri::command]
fn write_text_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("写入文件失败: {}", e))
}

#[tauri::command]
fn remove_file(path: String) -> Result<(), String> {
    fs::remove_file(&path)
        .map_err(|e| format!("删除文件失败: {}", e))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_dir,
            read_text_file,
            write_text_file,
            remove_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}