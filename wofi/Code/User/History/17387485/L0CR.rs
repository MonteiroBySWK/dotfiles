use std::io::Result;
use std::process::Command;

use dialoguer::{Input, Select, theme::ColorfulTheme};

fn init(url: String, target: String) -> Result<()> {
    let output = Command::new("git")
        .arg("clone")
        .arg(url)
        .arg(target)
        .output();
}

pub fn init_project() -> Result<()> {
   let urls = [];
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
