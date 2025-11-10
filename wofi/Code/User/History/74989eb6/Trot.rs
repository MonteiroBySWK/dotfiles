use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").expect("Falha ao fazer bind");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                println!("Nova Conexão {}", stream.peer_addr().unwrap());

            }
            Err(e) => {
                eprintln!("Erro na conexão {}", e);
            }
        }
    }
}
