import * as Generator from 'yeoman-generator'
import * as path from 'path'

interface Answers {
  name: string
  capitalName: string
}

const MODULE_ROOT = 'src/modules'

const templateTypes = [
  'errors',
  'pubsub',
  'schema',
  'service',
  'types',
]

export = class extends Generator {
  args: string[]
  private answers: Answers

  async promptUser () {
    const baseAnswers: Answers = {} as any
    const prompts = []
    if (this.args.length > 0) {
      baseAnswers.name = this.args[0]
    } else {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'What would you like to name your module (should be camelCase)?',
      })
    }
    const promptAnswers = await this.prompt(prompts)

    const answers = {
      ...promptAnswers,
      ...baseAnswers,
    }

    const { name } = answers
    this.answers = {
      ...answers,
      name: name[0].toLowerCase() + name.substring(1),
      capitalName: name[0].toUpperCase() + name.substring(1),
    }
  }

  generateModule () {
    const moduleDir = path.join(MODULE_ROOT, this.answers.name)

    templateTypes.forEach(type => {
      this.fs.copyTpl(
        this.templatePath(`module.${type}.ts.ejs`),
        this.destinationPath(path.join(moduleDir, `${this.answers.name}.${type}.ts`)),
        this.answers,
      )
    })
  }
}
