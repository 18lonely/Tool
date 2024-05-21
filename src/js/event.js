// "use strict"

import fn from "./handle.js"

const path = require('path')
const fs = require('fs')
let buttonAccount = document.querySelector('#navigation .nav-1')
let buttonFilter = document.querySelector('#navigation .nav-2')
let buttonPost = document.querySelector('#navigation .nav-3')

let screenAccount = document.querySelector('#account-screen')
let screenFilter = document.querySelector('#filter-group-screen')
let screenPost = document.querySelector('#auto-post-screen')

buttonAccount.addEventListener('click', (e) => {
    screenAccount.style.display = 'block' 
    screenFilter.style.display = 'none'
    screenPost.style.display = 'none'
})

buttonFilter.addEventListener('click', (e) => {
    screenAccount.style.display = 'none' 
    screenFilter.style.display = 'flex'
    screenPost.style.display = 'none'
})

buttonPost.addEventListener('click', (e) => {
    screenAccount.style.display = 'none' 
    screenFilter.style.display = 'none'
    screenPost.style.display = 'flex'
})

const getAccounts = (path) => {
    const data = fs.readFileSync(path, {encoding: 'utf8'})
    const arrs = data.split("\n")

    for(let index in arrs) {
        arrs[index] = arrs[index].split('|')
    }

    return arrs
}

const updateTableAccount = (accounts) => {
    let tableAccounts = document.querySelector('.table-accounts')
    tableAccounts.innerHTML = `
        <tr>
            <th class="th-0">CHECK</th>
            <th class="th-1">ID</th>
            <th class="th-2">PASSWORD</th>
            <th class="th-3">COOKIE</th>
            <th class="th-4">2FA</th>
            <th class="th-5">EMAIL</th>
            <th class="th-6">PASSWORD</th>
        </tr>`
    let id = 1
    for(let arr of accounts) {
        if(!arr[0]) continue
        tableAccounts.innerHTML += `
        <tr class="${id}">
          <td class="th-0">
            <input type="checkbox" name="" id="${id}">
          </td>
          <td class="th-1">
            <input type="text" value="${arr[0]}">
          </td>
          <td class="th-2">
            <input type="text" value="${arr[1]}">
          </td>
          <td class="th-3">
            <input type="text" value="${arr[2]}">
          </td>
          <td class="th-4">
            <input type="text" value="${arr[3]}">
          </td>
          <td class="th-5">
            <input type="text" value="${arr[4]}">
          </td>
          <td class="th-6">
            <input type="text" value="${arr[5]}">
          </td>
        </tr>
    `
        id += 1
    }
}

const updateOptionAccount = (accounts) => {
    let options = document.querySelectorAll('.options-account')
    options.forEach((value) => {
      value.innerHTML = ``
      let id = 1
      for(let arr of accounts) {
          if(!arr[0]) continue
          value.innerHTML += `
            <option value="${id}">${arr[0]}</option>
          `
          id += 1
      }
    })
}

let buttonAddAccount = document.querySelector(".button-add")
let buttonDeleteAccount = document.querySelector(".button-delete")
let buttonSaveAccount = document.querySelector(".button-save")

buttonAddAccount.addEventListener('click', (e) => {
    let tableAccounts = document.querySelector('.table-accounts')
    let tr = document.querySelectorAll('.table-accounts tr')
    tableAccounts.innerHTML += `
        <tr class="${tr.length}">
          <td class="th-0">
            <input type="checkbox" name="" id="${tr.length}">
          </td>
          <td class="th-1">
            <input type="text">
          </td>
          <td class="th-2">
            <input type="text">
          </td>
          <td class="th-3">
            <input type="text">
          </td>
          <td class="th-4">
            <input type="text">
          </td>
          <td class="th-5">
            <input type="text">
          </td>
          <td class="th-6">
            <input type="text">
          </td>
        </tr>
    `
})

buttonSaveAccount.addEventListener('click', (e) => {
    let tr = document.querySelectorAll('.table-accounts tr')

    let accounts = ""
    for(let index = 1; index < tr.length; index++) {
        let properties = tr[index].querySelectorAll("input")
        accounts += `${properties[1].value}|${properties[2].value}|${properties[3].value}|${properties[4].value}|${properties[5].value}|${properties[6].value}\n`
    }

    fs.writeFileSync(path.resolve(__dirname, '../json/accounts.txt'), accounts, {encoding: 'utf8'})
    updateOptionAccount(getAccounts(path.resolve(__dirname, '../json/accounts.txt')))
})

buttonDeleteAccount.addEventListener('click', (e) => {
    let tr = document.querySelectorAll('.table-accounts tr')

    let accounts = ""
    for(let index = 1; index < tr.length; index++) {
        let properties = tr[index].querySelectorAll("input")
        if(properties[0].checked) {
            continue
        }
        accounts += `${properties[1].value}|${properties[2].value}|${properties[3].value}|${properties[4].value}|${properties[5].value}|${properties[6].value}\n`
    }

    fs.writeFileSync(path.resolve(__dirname, '../json/accounts.txt'), accounts, {encoding: 'utf8'})
    updateTableAccount(getAccounts(path.resolve(__dirname, '../json/accounts.txt')))
    updateOptionAccount(getAccounts(path.resolve(__dirname, '../json/accounts.txt')))
})

updateTableAccount(getAccounts(path.resolve(__dirname, '../json/accounts.txt')))
updateOptionAccount(getAccounts(path.resolve(__dirname, '../json/accounts.txt')))

let groupsFindByKeyWord

let buttonFindGroupByKeyword = document.querySelector('.button-run')

let getAccountsByUID = (UID) => {
  let accounts = getAccounts(path.resolve(__dirname, '../json/accounts.txt'))

  for(let arr of accounts) {
    if(arr[0] == UID) {
      return arr
    }
  }
  return undefined
}

buttonFindGroupByKeyword.addEventListener('click', async (e) => {
  let options = document.querySelector('.choose-account .options-account')  
  let accountSelected = getAccountsByUID(options.options[options.selectedIndex].innerText)
  let keyword = document.querySelector('.input-keyword input').value
  let n = document.querySelector('.input-sl input').value
  let groupsFindByKeyWord = await fn.findGroupByKyeword(keyword, Number(n), accountSelected[0], accountSelected[1])
  
  let container = document.querySelector('#filter-group-screen .container')
  container.innerHTML = ''

  for(let i in groupsFindByKeyWord) {
    container.innerHTML += `
          <div class="gr gr${i}">
            <div class="left-gr">
              <img src="${groupsFindByKeyWord[i][2]}" alt="">
            </div>
            <a href="${groupsFindByKeyWord[i][1]}" class="right-gr">
              ${groupsFindByKeyWord[i][0]}
            </a>
            <div class="delete">
              <button class="${i}">X</button>
            </div>
          </div>`
  }

  document.querySelectorAll(`#filter-group-screen .container .gr .delete button`).forEach((value) => {
    value.addEventListener('click', (e) => {
      let id = Number(e.target.className)
      document.querySelector(`#filter-group-screen .container .gr${id}`).remove()
      groupsFindByKeyWord[id] = []
      console.log(groupsFindByKeyWord)
    })
  })
})

// Auto join group

let filesInput = []
let yourGroups

let inputFile = document.querySelector('#auto-post-screen .image input')
let buttonGetYourGroup = document.querySelector('.button-filter-your-group')
let buttonAction = document.querySelector('.button-post')

inputFile.addEventListener('change', (e) => {
  for(let file of e.target.files)
    filesInput.push(file.path)
})

buttonGetYourGroup.addEventListener('click', async (e) => {
  let options = document.querySelector('#auto-post-screen .choose-account .options-account')  
  let accountSelected = getAccountsByUID(options.options[options.selectedIndex].innerText)

  yourGroups = await fn.getYourGroups(accountSelected[0], accountSelected[1])

  let container = document.querySelector('#auto-post-screen .list-group')
  container.innerHTML = ''

  for(let i in yourGroups) {
    container.innerHTML += `
        <div class="gr gr${i}">
        <div class="l">
          <img src="${yourGroups[i][2]}" alt="">
        </div>
        <div class="r">
          <a href="${yourGroups[i][0]}">
            ${yourGroups[i][1]}
          </a>
        </div>
        <div class="delete">
          <button class="${i}">X</button>
        </div>
      </div>`
  }

  document.querySelectorAll(`#auto-post-screen .list-group .delete button`).forEach((value) => {
    value.addEventListener('click', (e) => {
      let id = Number(e.target.className)
      document.querySelector(`#auto-post-screen .list-group .gr${id}`).remove()
      yourGroups[id] = []
    })
  })
})

buttonAction.addEventListener('click', async (e) => {
  let options = document.querySelector('#auto-post-screen .choose-account .options-account')  
  let accountSelected = getAccountsByUID(options.options[options.selectedIndex].innerText)
  
  let content = document.querySelector('#auto-post-screen .combo-content .content').value
  let delay = document.querySelector('.input-time').value.split('-')
  console.log(yourGroups)

  await fn.autoPostGroupsFacebook(accountSelected[0], accountSelected[1], yourGroups, content, filesInput, delay)
})


