//seleciona os elementos do formulario.
const form = document.querySelector("form")
const amount =  document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//captura o evento de input para formatar o valor.
amount.oninput = () => {
    //obtem o valor atual do input e remove os caracteres nao numericos
    let value =  amount.value.replace(/\D/g, "")

    // transformar o valor em centavos
    value = Number(value) /100
    
    //atualiza o valor do input
    amount.value = formatCurrencyBRL(value)
    
}

function formatCurrencyBRL(value){
    // formata o valor no padrao brl
    value = value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    })

    //retorna o valor formatado
    return value
}

form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date(),
    }

    expenseAdd(newExpense)
}

//adiciona um novo item na lista
function expenseAdd(newExpense){
    try {
        // cira elemento de li para adicionar o item na lista.
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")

        // cria o icone da categoria
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //cria a info da despesa.
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        // cria o nome da despesa
        const expenseName = document.createElement("strong")
        expenseName.textContent = newExpense.expense

        //cria a categoria da despesa
        const expenseCategory = document.createElement("span")
        expenseCategory.textContent = newExpense.category_name

        //adiciona o name e category em expense info
        expenseInfo.append(expenseName, expenseCategory)

        //cria o valor da despesa.
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace("R$", "")}`

        //  cira o icone de remover
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", "img/remove.svg")
        removeIcon.setAttribute("alt", "remover")  

          // adiciona as informaçoes no item.
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

        //adiciona o item na lista
        expenseList.append(expenseItem)

        //limpa o formulario para adicionar um novo item 
        formClear()

      //atualiza os totais.
      updateTotals()
    } catch (error) {
        alert("nao foi possivel atualizar a lista")
        console.log(error)
    }
}

//atualiza os totais
function updateTotals(){
    try {
        //recupera todos os (li) da lista (ul)
        const items = expenseList.children
        
        //atualiza a quantidade de items da lista
        expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

        //variavel para icrementar o total.
        let total = 0


        //percorre cada item (li) da lista (ul)
        for(let item  = 0; item < items.length; item++){
            const itemAmount = items[item].querySelector(".expense-amount")

            //remover caracteres nao numericos e substitui a virgula pelo ponto.
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",",".")

            //converte o valor para float
            value = parseFloat(value)

            //verificar se e um numero valido
            if(isNaN(value)){
                return alert("nao foi possivel calcular o total. o valor nao parece ser um numero")
            }

            // incrementar o valor total
            total += Number(value)

        }

        //cria a span para adicionar o R$ formatado.
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        //formata o valor e tira o R$ que sera exibido pela a small com um estilo customizado
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //limpa o conteudo do elemento
        expensesTotal.innerHTML = ""

        //adiciona o simbolo da moeda e o valor
         expensesTotal.append(symbolBRL, total)
    } catch (error) {
        console.log(error) 
        alert("nao foi possivel atualizar")
    }
}

//evento que captua o clique nos itens da lista
expenseList.addEventListener("click", function (event) {
    //verificar se o elemento clicado e o icone de remover
    if(event.target.classList.contains("remove-icon")){
      //obtem a (li) pai do elemento clicado
      const item = event.target.closest(".expense")
      
      //remove o item da lista
      item.remove()
    }
    //atualioza os totais
    updateTotals()
})

function formClear(){
    //limpa os inputs
    expense.value = ""
    category.value = ""
    amount.value = ""

    //coloca o foco no input de amount
    expense.focus()

}
