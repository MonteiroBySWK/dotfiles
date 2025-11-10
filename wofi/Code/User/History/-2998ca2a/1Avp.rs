pub mod initialize_project;

use color_eyre::{Result, eyre::Ok, owo_colors::OwoColorize};
use dialoguer::{Input, Select, theme::ColorfulTheme};

use std::{fs, option, path::Path};

fn show_banner() {
    let path = Path::new("assets/banner.txt");
    let banner = fs::read_to_string(path);

    if let Result::Ok(text) = banner {
        println!("{}", text.purple().bold());
    } else {
        eprintln!("Erro ao ler o banner")
    }
}

fn init_project() -> Result<()> {
    loop {
        let options = &["Java + Spring", "React Native/Expo", "React/Next", "Voltar"];

        let choose = Select::with_theme(&ColorfulTheme::default())
            .with_prompt("Qual stack?")
            .default(0)
            .items(options)
            .interact()?;

        match choose {
            0 => {
                println!("Iniciando Projeto Java + Spring");
            }
            1 => {
                println!("Inciando Projeto React Native");
            }
            2 => {
                println!("Iniciando Projeto Reacr/Next");
            }
            3 => {
                break;
            }
            _ => unreachable!(),
        }
    }

    Ok(())
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
                init_project();
            }
            2 => {
                break;
            }
            _ => unreachable!(),
        }
    }

    Ok(())
}
