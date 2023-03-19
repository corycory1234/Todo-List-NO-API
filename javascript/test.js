//  (1)新增add的DOM
let inputText = document.querySelector("#inputText");
let addBtn = document.querySelector("#addBtn");
let todoArr = [];
//  (0)渲染render要用的DOM
let list = document.querySelector("#list");
//  (2)tab切換的DOM
let tab = document.querySelector("#tab");
let tabChilds = document.querySelectorAll("#tab li");
//  (3)刪除的DOM
let del = document.querySelector(".delete");
//  (4)更新代辦清單的DOM
let notDone_Num = document.querySelector("#notDone_Num");
//  (5)刪除已完成的DOM
let del_Done = document.querySelector("#del_Done");



//  (0)渲染
function render (arr){
    let str ="";
    //LI埋data-id =""
    //checkbox要上${item.checked}，因checkbox被打勾，HTML會顯示checked
    arr.forEach((item,index) => {
        str += `<li data-id="${item.id}">
    <label class="checkbox" for="">
      <input type="checkbox" ${item.checked}>
      <span>${item.text}</span>
    </label>
    <a href="#" class="delete" data-num="${index}"></a>
  </li>`    
    });
    list.innerHTML = str;
}


//  (1)新增
addBtn.addEventListener("click", addTodo);
function addTodo (){
    //防呆，不能空字串
    if (inputText.value.trim() === ""){
        alert("不可空字串");
        return;
    };
//  新增字串不會只有單純是text.value，會是一包含各種資訊物件
//  checked是為搭配勾選功能的checkbox，判斷「已完成」「未完成」
//  id時間戳
    let todoObj = {
        text: inputText.value,
        id: new Date().getTime(),
        checked: "", 
    };
    todoArr.unshift(todoObj);
    inputText.value = "";
    //把todoArr陣列當作參數，丟給render函式做渲染
    // render(todoArr);
    update_Todo();
}



//  (2)tab切換：全部、未完成、已完成
//  第一個LI已在HTML寫入.active了，其餘的LI，必須透過CSS與JS加上.active
tab.addEventListener("click", tabSwitch)
let tabStatus = "all";
function tabSwitch(event){
    // console.log(event.target.dataset.tab);
//  tabStatus會依據切換，而印出data-tab = ""，做為click點擊驗證是否成功;
    tabStatus = event.target.dataset.tab
//  透過forEach迴圈(不然1筆筆寫太冗)，先把.active全刪，
//  等點擊到再加上.active(不然點擊到「已完成」，前一個「未完成」的.active底線不會消失)
    tabChilds.forEach((item) =>{
        item.classList.remove("active");
    });
    event.target.classList.add("active");
    update_Todo();
}



//  (3)單獨LI刪除 & Checkbox狀態
//  單一刪除LI是UL的子層，因此父層監聽子層
//  刪除 & 切換，一定要先取得「ID」
list.addEventListener("click", delAndCheck);
function delAndCheck(event){
//  此版型, LI不好點(大概在刪除鍵的下方)
    let id = event.target.closest("li").dataset.id;

//  如點到delete刪除鍵，該陣列的元素id，
//  就沒有id(也就是filter保留有id的元素，並把有id的元素，加到新的陣列)
    if(event.target.classList.value === "delete"){
//  因為delete是A標籤，所以要上個「預防」
        event.preventDefault();
//  不懂箭頭函式, 放{}, 按刪除=全刪除???????????? 
//  嚴格不相等!==也會造成全刪除/或沒{}時, 卻無法單一刪除 */
//  item.id這邊型別是Number，而id型別是字串
        todoArr = todoArr.filter((item) => item.id != id, );
    }
//  else，點到delete之外(意指點到checkbox的input)

    else{
        todoArr.forEach((item, index) => {
//  用嚴格相等, 無法勾選, 
//  因為item.id的型別是string(受陣列影響), id變數的型別則是Number 
            if(item.id == id){
                // console.log(typeof item.id, typeof id);
//  102行卻可以用嚴格相等, 這邊應該型別都是字串???????
//  [index]這一大段，不太清楚邏輯?????????????
                if(todoArr[index].checked === "checked"){
                    todoArr[index].checked = "";
                }else{
                    todoArr[index].checked = "checked";
                };
            };
        })
    };
//  被刪除或是打勾，畫面都要重新渲染
    // render(todoArr);
    update_Todo();
}


//  (4)更新代辦清單
function update_Todo(){
//  為何這裡還要設1空陣列，去跟todoArr做===，不能用todoArr的原因是甚麼???
    let update_Arr = [];
    if(tabStatus === "all"){
        update_Arr = todoArr;
    }else if(tabStatus === "notDone"){
//  未完成, 於checked標上空字串
//  箭頭函式若加上{}, 待完成&已完成, inputText.value字串不會被渲染
        update_Arr = todoArr.filter((item) => item.checked === "");
    }else{
//  已完成, 於checked標上"checked"
//  箭頭函式若加上{}, 待完成&已完成, inputText.value字串不會被渲染
        update_Arr = todoArr.filter((item) => item.checked === "checked");
    };
//  抓span長度
    let notDone_Length = todoArr.filter((item) => item.checked === "");
    notDone_Num.textContent = notDone_Length.length;
//  若upda_Todo(update_Arr)，會造成堆疊上限，報錯
    render(update_Arr);
};


//  這邊初始化的用意，只是讓一開始進入頁面tabStatus = "all"
update_Todo();


//  (5)刪除「已完成」
del_Done.addEventListener("click", function (event){
//  預防A標籤
    event.preventDefault()
//  過濾掉checked ==="checked"，留下checked: ""
    todoArr = todoArr.filter((item) => item.checked === "");
//  過濾完，必須更新頁面
    update_Todo();
});


// (6)優化, 按Enter即可啟動 新增
inputText.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        addTodo();
    }
})