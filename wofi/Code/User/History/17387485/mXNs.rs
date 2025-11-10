use clap::error::Result;
use dialoguer::Input;

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