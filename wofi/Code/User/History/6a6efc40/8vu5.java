package br.uema.sigep.api;

import br.uema.sigep.entity.Programa;
import br.uema.sigep.service.ProgramaService;
import br.uema.sigep.util.BaseController;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author mauricio
 */
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/programas")
public class ProgramaController extends BaseController<Programa, ProgramaService> {

    // Métodos CRUD básicos herdados do BaseController
    // Adicione métodos específicos aqui se necessário
}
