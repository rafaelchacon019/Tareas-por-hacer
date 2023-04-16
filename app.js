import colors from 'colors';
import { inquiererMenu, pausa, leerInput, listadoTareasBorrar,confirmarBorrado, mostrarListadoChecklist } from './helpers/inquirer.js';
import Tareas from './models/tareas.js';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';

const main = async() =>{

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if(tareasDB){
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        // Imprimir el menu
       opt = await inquiererMenu();

       switch (opt) {
        case '1':
            // crear opcion
            const desc = await leerInput('Descripcion:');
            tareas.crearTarea(desc);
        break;
       
        case '2':
            tareas.listadoCompleto();
        break;

        case '3': // Listar completadas
            tareas.listarPendientesCompletadas(true);
        break;

        case '4':// Listar pendientes
            tareas.listarPendientesCompletadas(false);
        break;

        case '5':// completado | pendiente
            const ids = await mostrarListadoChecklist(tareas.listadoArr);
            tareas.toggleCompletadas(ids);
        break;

        case '6': // Borrar

            const id = await listadoTareasBorrar(tareas.listadoArr);
            if(id !== '0'){
                const ok = await confirmarBorrado('¿Esta seguro?');  
                if (ok){
                    tareas.borrarTarea(id);
                    console.log('Tarea borrada'.green);
                }else{
                    console.log('No se pudo borrar tarea'.red);
                }
            }
        break;
       }

       guardarDB(tareas.listadoArr);

       await pausa();

    } while (opt !== '0');
}

main();