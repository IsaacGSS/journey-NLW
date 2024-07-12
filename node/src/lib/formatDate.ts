import { format, parseISO } from "date-fns";
import { ptBR } from 'date-fns/locale/pt-BR'

const FormatDate = (data: Date | string | undefined, schema?: string | undefined | null) => {

  let Schema = schema

  if(typeof Schema === 'undefined' || Schema == null) {
    Schema = "d MMMM yyyy"
  }

  if(typeof data === "undefined"){
    return format(new Date, Schema, {locale: ptBR})
  }

  if(typeof data === "string"){
    const formatData = parseISO(data)

    return format(formatData, Schema, {locale: ptBR})
  }

  return format(data, Schema, {locale: ptBR})
}

export default FormatDate