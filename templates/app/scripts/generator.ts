import { Catalog, Config } from '../../../src/utils/config.default'
import HTML = marked.Tokens.HTML

const makeLink = (name: string, path: string): string => {
  return name.replace(path, '')
}

const makeList = async(catalogs: Catalog[], path, d: Document) => {
  const ul: HTMLElement = d.createElement('ul')
  for (const unit of catalogs) {
    const li: HTMLElement = d.createElement('li')
    const link: string = makeLink(unit.fileName, path)
    
    // is directory
    if (unit.children && unit.children.length > 0) {
      li.innerHTML = `<p class="chapter dir"><a>${unit.name}</a></p>`
      li.classList.add('sub-list-container')
      const subList: HTMLElement = await makeList(unit.children, path, d)
      subList.classList.add('sub-list')
      li.appendChild(subList)
    } else {
      li.innerHTML = `<p class="chapter link"><a href="#${link}">${unit.name}</a></p>`
    }
    ul.appendChild(li)
  }
  
  return ul
}

export const side = async(catalogs: Catalog[], config: Config): Promise<HTMLElement> => {
  const d: Document = document
  const ul: HTMLElement = await makeList(catalogs, config.__user_source_path, d)
  return ul
}


const initSubList = async () => {
  const containers: NodeListOf<Element> = document.querySelectorAll('.sub-list-container')
  const subList: NodeListOf<Element> = document.querySelectorAll('.sub-list')
  const handle: Function = (event: Event, container: Element) => {
    const listLength = container.children.length - 1
    const height: number = listLength * 40
    const sub: HTMLElement = container.querySelector('.sub-list')
    sub.style.height = sub.offsetHeight > 0 ? '0px' : `${height}px`
  }
  Array.from(containers).forEach(con => {
    con.addEventListener('click', (event: Event) => handle(event, con))
  })
  Array.from(subList).forEach(sub => {
    sub.addEventListener('click', (event: Event) => event.stopPropagation())
  })
}

export const event = async(): Promise<void> => {
  await initSubList()
}