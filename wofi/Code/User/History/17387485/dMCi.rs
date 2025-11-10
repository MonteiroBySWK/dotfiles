use color_eyre::eyre::Result;
use dialoguer::{theme::ColorfulTheme, Input, Select};

fn init() {

}



pub fn init_project() -> Result<()> {
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
