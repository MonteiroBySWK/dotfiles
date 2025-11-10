use std::{net::TcpListener, thread};

fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").expect("Falha ao fazer bind");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                println!("Nova Conexão {}", stream.peer_addr().unwrap());
                thread::spawn(move || {
                    let mut buffer = [0; 1024];

                    match stream.read(&mut buffer) {
                        Ok(size) => {
                            let request = String::from_utf8_lossy(&buffer[..size]);
                            println!("Request recebida:\n{}", request);

                            // Resposta HTTP básica
                            let response = "HTTP/1.1 200 OK\r\n\r\nHello from std::net!";

                            if let Err(e) = stream.write_all(response.as_bytes()) {
                                eprintln!("Erro ao enviar resposta: {}", e);
                            }
                        }
                        Err(e) => {
                            eprintln!("Erro ao ler request: {}", e);
                        }
                    }
                })
            }
            Err(e) => {
                eprintln!("Erro na conexão {}", e);
            }
        }
    }
}
