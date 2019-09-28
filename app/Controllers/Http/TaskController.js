'use strict'

const Task = use('App/Models/Task')
const { validateAll } = use('Validator')

class TaskController {
  async index({ view }) {
    const tasks = await Task.all()

    return view.render('tasks', {
      title: 'Latest tasks',
      tasks: tasks.toJSON()
    })
  }

  async store({ request, response, session }) {

    const message = {
      'title.required': 'Required',
      'title.min': 'min 3'
    }

    const validation = await validateAll(request.all(), {
      title: 'required|min:5|max:140',
      body: 'required|min:10'
    }, message)

    if (validation.fails()){
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }

    const task = new Task()

    task.title = request.input('title')
    task.body = request.input('body')

    await task.save()

    // session.flash({ notification: 'Task added!'}) pode ser passada a notification para a pagina web do formulario por meio das rotas

    return response.redirect('/tasks')
  }

  async detail({ params, view }) {
    const task = await Task.find(params.id)

    return view.render('detail', {
      task: task
    })
  }

// Função para remover tarefa:
// * 'DELETE' é uma palavra reservada.
// Usar remove ou destroy para apagar registro;
// 1# Selecionar tarefa , pelo seu id
// 2# Apagar tarefa pelo comando delete;
  async remove({ params, response, session }) {
    const task = await Task.find(params.id)
    await task.delete()
    session.flash({ notification: 'Task removed!' })

    return response.redirect('/tasks')
  }
// Após função pronta, retornar para visualização das outras Tasks;
// Depois, criar rota para o remove

}

module.exports = TaskController
