import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';

/*var SibApiV3Sdk = require('sib-api-v3-sdk');
var defaultClient = SibApiV3Sdk.ApiClient.instance;*/

export class TodoController {
  constructor(
    @repository(TodoRepository)
    public todoRepository : TodoRepository,
  ) {}

  @post('/todos')
  @response(200, {
    description: 'Todo model instance',
    content: {'application/json': {schema: getModelSchemaRef(Todo)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {
            title: 'NewTodo',
            exclude: ['id'],
          }),
        },
      },
    })
    todo: Omit<Todo, 'id'>,
  ): Promise<Todo> {
    return this.todoRepository.create(todo);
  }

  @get('/todos/count')
  @response(200, {
    description: 'Todo model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.count(where);
  }

  @get('/todos')
  @response(200, {
    description: 'Array of Todo model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Todo, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Todo) filter?: Filter<Todo>,
  ): Promise<Todo[]> {
    return this.todoRepository.find(filter);
  }

  @patch('/todos')
  @response(200, {
    description: 'Todo PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Count> {
    return this.todoRepository.updateAll(todo, where);
  }

  @get('/todos/{id}')
  @response(200, {
    description: 'Todo model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Todo, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>
  ): Promise<Todo> {
    return this.todoRepository.findById(id, filter);
  }

  @patch('/todos/{id}')
  @response(204, {
    description: 'Todo PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    todo: Todo,
  ): Promise<void> {
    await this.todoRepository.updateById(id, todo);
  }

  @put('/todos/{id}')
  @response(204, {
    description: 'Todo PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() todo: Todo,
  ): Promise<void> {
    await this.todoRepository.replaceById(id, todo);
  }

  @del('/todos/{id}')
  @response(204, {
    description: 'Todo DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.todoRepository.deleteById(id);
  }

  @get('/test-email')
  @response(200, {
    description: 'testing email to send',
  })
  async testSendEmail(
  ) {
    //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
    console.log("testing the email");
    const SibApiV3Sdk = require('sib-api-v3-sdk');
    let defaultClient = SibApiV3Sdk.ApiClient.instance;

    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';

    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // sendSmtpEmail.subject = "My {{params.subject}}";
    sendSmtpEmail.subject = "My Test emailmk";
    sendSmtpEmail.htmlContent = "<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>";
    sendSmtpEmail.sender = {"name":"Milan Kumar","email":"milanresonite@gmail.com"};
    sendSmtpEmail.to = [{"email":"milangne123@gmail.com","name":"Satyam Kr"}];
    sendSmtpEmail.cc = [{"email":"milan2pawan@gmail.com","name":"Janice Doe"}];
    // sendSmtpEmail.bcc = [{"email":"jeevan","name":"sales@appositesolution.site"}];
    sendSmtpEmail.replyTo = {"email":"satyamkr141@gmail.com","name":"John Doe"};
    sendSmtpEmail.headers = {"Some-Custom-Name":"unique-id-1234"};
    sendSmtpEmail.params = {"parameter":"My param value","subject":"New Subject"};

    await apiInstance.sendTransacEmail(sendSmtpEmail).then((data:any) => {
      console.log("email sent");
      console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, (error:any) => {
      console.log("email failed");
      console.error(error);
    });

  }


}
