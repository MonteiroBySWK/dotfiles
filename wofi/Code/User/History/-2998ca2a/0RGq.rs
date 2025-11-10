use color_eyre::{Result, eyre::Ok, owo_colors::OwoColorize};
use dialoguer::{Input, Select, theme::ColorfulTheme};

use std::{fs, path::Path};

fn show_banner() {
    let path = Path::new("assets/banner.txt");
    let banner = fs::read_to_string(path);

    if let Result::Ok(text) = banner {
        println!("{}", text.purple().bold());
    } else {
        eprintln!("Erro ao ler o banner")
    }
}

fn converter_arquivo() -> Result<()> {
    println!("Submetendo arquivos");

    let input: String = Input::new()
        .with_prompt("path/to/file a modificar: ")
        .interact_text()?;

    let output: String = Input::new()
        .with_prompt("nome do arquivo de saida: ")
        .interact_text()?;

    println!("entrada: {}", input);
    println!("saida: {}", output);

    Ok(())
}

fn init_project() {
    loop {
        let options = &["Java + Spring", "React Native/Expo", "React/Next"];

        let choose = Select::with_theme(&ColorfulTheme::default())
            .with_prompt("Qual stack?")
            .default(0)
            .interact()?;
    }
}

fn main() -> Result<()> {
    let _ = color_eyre::install();

    show_banner();

    loop {
        let options = &["Converter Documento", "Inicializar Projeto", "Sair"];

        let choose = Select::with_theme(&ColorfulTheme::default())
            .with_prompt("O que você quer fazer?")
            .default(0)
            .items(options)
            .interact()?;

        match choose {
            0 => {
                converter_arquivo();
            }
            1 => {
                println!("Yes");
            }
            2 => {
                break;
            }
            _ => unreachable!(),
        }
    }

    Ok(())
}
