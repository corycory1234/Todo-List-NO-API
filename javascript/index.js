let inputText = document.querySelector("#inputText");
let addBtn = document.querySelector("#addBtn");
let todoList_Data = [];
let list = document.querySelector("#list")

//  (1)監聽新增
addBtn.addEventListener("click", addTodo)

function addTodo (){
    //  新增物件, 將其新增至空陣列
    let todo_Obj = {
        txt: inputText.value, 
        id: new Date().getTime(), // ID為時間戳???
        checked: "", // 打勾後, 畫橫線
    };
    if (inputText.value !== ""){
        todoList_Data.unshift(todo_Obj);
        inputText.value ="";
    }else{
        alert("請輸入代辦事項!!!")
    }
    // render();



    done_list();
};


// (7) 優化
inputText.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        addTodo();
    }
})





// (2)渲染
// ${}對照todo_Obj裡面的key
function render() {
    let str = "";
    todoList_Data.forEach((item, index) => {
        str += `<li data-id=${item.id}>
        <label class="checkbox" for="">
          <input type="checkbox" ${item.checked} />
          <span>${item.txt}</span>
        </label>
        <a href="#" class="delete" data-num="${index}"></a>
      </li>`
    })
    list.innerHTML = str;
}


// (3)tab切換 (CSS樣式)
let tab = document.querySelector("#tab");
let toggleStatus = "all"    // 讓tab於剛載入頁面時, 賦於1個狀態
tab.addEventListener("click", function(event) {
    // console.log(event.target.getAttribute("data-tab"));
    toggleStatus = event.target.getAttribute("data-tab"); // 將toggleStatus賦於data-tab屬性值
    let tabs = document.querySelectorAll("#tab li"); // 抓ul裡面所有li
    tabs.forEach((item, index) => {
        item.classList.remove("active"); // 讓ul跑forEach, 刪除所有active之底線
    });
    event.target.classList.add("active"); // 為何這裡是用event?
    
    

    done_list();
});


// (4)刪除、切換 Checked 狀態功能
list.addEventListener("click", function(event){
    let id = event.target.closest("li").dataset.id;

    if(event.target.getAttribute("class") === "delete"){
        let num = event.target.getAttribute("data-num");
        todoList_Data.splice(num,1);
        // filter過濾刪除寫法
        // todoList_Data = todoList_Data.filter((item)=> item.id != id);  
    }else{
        todoList_Data.forEach((item, index) =>{
            if(item.id == id){
                if(todoList_Data[index].checked === "checked"){
                    todoList_Data[index].checked = ""; // 把"checked"狀態拿掉?
                }else{
                    todoList_Data[index].checked = "checked"; // 
                }
            }
        })
    };


    // render();
    done_list();
});


// (5)更新代辦清單
function done_list (){
    let done_Data = [];
    if(toggleStatus === "all"){
        done_Data = todoList_Data;
    }else if(toggleStatus === "notFinished"){
        done_Data = todoList_Data.filter((item) => {item.checked == ""});
    }else{
        done_Data = todoList_Data.filter((item) => {item.checked == "done"});
    };



    let notFinishedNum = document.querySelector("#notFinishedNum");
    let todoLength = todoList_Data.filter((item) => (item.checked == ""));
    notFinishedNum.textContent = todoLength.length;
    render(done_Data);
}

// 初始
done_list();




// (6)刪除已完成 todo
let deleteBtn = document.querySelector("#deleteBtn");
deleteBtn.addEventListener("click", function(event){
    event.preventDefault();
    todoList_Data = todoList_Data.filter((item) => {item.checked != "checked"});
    done_list();
})