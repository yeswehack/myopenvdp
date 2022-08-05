import { StringWriter } from './utils.mjs';

function mdBold(string) {
  return `**${string}**`;
}

function mdItalic(string) {
  return `*${string}*`;
}

function mdCode(string) {
  return `\`${string}\``;
}

function mdDescribeApi(writer, api) {
  switch (api.type) {
    case 'component':
      mdDescribeProperties(writer, api);
      mdDescribeEvents(writer, api);
      break
  }
}

function mdDescribeProperties(writer, { props }) {
  const keys = Object.keys(props || {});

  writer.writeLine();
  writer.writeLine('## Properties')
  writer.writeLine();

  if (keys.length === 0) {
    writer.writeLine(mdItalic('No properties'));
    return
  }

  for (let propName in props) {
    mdDescribeProp(writer, props[propName], propName, 0)
  }
}

function mdDescribeEvents(writer, { events }) {
  const keys = Object.keys(events || {})

  writer.writeLine();
  writer.writeLine('## Events')
  writer.writeLine();

  if (keys.length === 0) {
    writer.writeLine(mdItalic('No events'))
    return
  }

  for (let eventName in events) {
    const event = events[eventName]

    writer.writeLine(`- ${mdBold('@' + eventName) + mdGetEventParams(event)}`)
    writer.writeLine(`  - ${mdBold('Description')}: ${event.desc}`)
    if (!event.params) {
      writer.writeLine(`  - ${mdBold('Parameters')}: ${mdItalic('None')}`)
    }
    else {
      writer.writeLine(`  - ${mdBold('Parameters')}:`)
      for (let paramName in event.params) {
        mdDescribeProp(writer, event.params[paramName], paramName, 4)
      }
    }
  }
}

function mdGetEventParams(event) {
  const params = event.params === void 0 || event.params.length === 0
    ? ''
    : Object.keys(event.params).map(mdCode).join(', ')

  return ' -> function(' + params + ')'
}

function getMethodParams(method, noRequired) {
  if (!method.params || method.params.length === 0) {
    return '()'
  }

  if (noRequired === true) {
    return `(${Object.keys(method.params).join(', ')})`
  }

  const params = Object.keys(method.params)
  const optionalIndex = params.findIndex(param => method.params[param].required !== true)

  const str = optionalIndex !== -1
    ? params.slice(0, optionalIndex).join(', ') +
      (optionalIndex < params.length
        ? '[' + (optionalIndex > 0 ? ', ' : '') + params.slice(optionalIndex).join(', ') + ']'
        : '')
    : params.join(', ')

  return ' (' + str + ')'
}

function getMethodReturnValue(method) {
  return ' => ' +
    (!method.returns
      ? 'void 0'
      : method.returns.type
    )
}

function getStringType (type) {
  return Array.isArray(type)
    ? type.join(' | ')
    : type
}

function mdDescribeProp(writer, prop, propName, indentLevel) {
  let indent = ' '.repeat(indentLevel)

  const type = getStringType(prop.type)

  if (propName !== void 0) {
    writer.writeLine(`${indent}- ${mdBold(mdCode(propName))} ${type ? `(${type})` : ''}${type !== 'Function' && prop.required ? ' [Required]' : ''}${prop.reactive ? ' [Reactive]' : ''}`)

    indentLevel += 2
    indent += '  '
  }

  writer.writeLine(`${indent}- ${mdBold('Description')}: ${prop.desc}`)
  if (type === 'Function') {
    writer.writeLine(`${indent}- ${mdBold('Function form')}: ${mdCode(getMethodParams(prop, true) + getMethodReturnValue(prop))}`)
  }
  if (prop.values) {
    writer.writeLine(`${indent}- ${mdBold('Accepted values')}: ${prop.values.map(mdCode).join(` | `)}`)
  }
  if (prop.default) {
    writer.writeLine(`${indent}- ${mdBold('Default value')}: ${mdCode(prop.default)}`)
  }
  if (prop.definition) {
    writer.writeLine(`${indent}- ${mdBold('Props')}:`)
    for (let propName in prop.definition) {
      mdDescribeProp(writer, prop.definition[propName], propName, indentLevel + 2)
    }
  }
  if (prop.params) {
    writer.writeLine(`${indent}- ${mdBold('Params')}:`)
    for (let propName in prop.params) {
      mdDescribeProp(writer, prop.params[propName], propName, indentLevel + 2)
    }
  }
  if (prop.returns) {
    writer.writeLine(`${indent}- ${mdBold('Returns')} ${getStringType(prop.returns.type)}:`)
    mdDescribeProp(writer, prop.returns, void 0, indentLevel + 2)
  }
  if (prop.scope) {
    writer.writeLine(`${indent}- ${mdBold('Scope:')}`)
    for (let propName in prop.scope) {
      mdDescribeProp(writer, prop.scope[propName], propName, indentLevel + 2)
    }
  }
  if (prop.examples !== void 0) {
    writer.writeLine(`${indent}- ${mdBold('Example' + (prop.examples.length > 1 ? 's' : ''))}:`)
    prop.examples.forEach(example => {
      writer.writeLine(`${indent}  - ${mdCode(example)}`)
    })
  }
}

export function jsonApiToMarkDown(name, api) {
  const writer = StringWriter.create();
  writer.writeLine(`# ${name} ${api.type} API`)

  mdDescribeApi(writer, api);

  return writer.toString();
}


