let inputText = document.querySelector("#inputText");
let addBtn = document.querySelector("#addBtn");
let list = document.querySelector("#list")
let todo_Arr = [];

// (1)新增
addBtn.addEventListener("click", buttonAdd); // (1)於監聽內, 可放入函式
function buttonAdd() {
    let todo_obj = {
        text: inputText.value,    // (2)text為輸入的value
        id: new Date().getTime(), // (2)用於刪除、切換狀態; 時間戳???
        checked: "", // (2)判斷 已完成 或 未完成
    };
    if(inputText.value !== ""){    // (3)防呆
        todo_Arr.unshift(todo_obj); // (3)物件丟到空陣列
        inputText.value = "";
    };
    // render();
    done_list();
};


// (2)渲染  
function render (arr){
    let str = "";
    // (1)data-id = "${item.id}" 為物件obj的key
    // (2)${item.text} 為物件obj的key
    // (3)${item.checked} 為物件obj的key
    // (4)${index} 為物件索引值, 為各刪除標籤上索引值
    arr.forEach((item, index) => {
        str += `<li data-id="${item.id}"> 
        <label class="checkbox" for="">
          <input type="checkbox" ${item.checked}/>
          <span>${item.text}</span>
        </label>
        <a href="#" class="delete" data-num="${index}"></a>
      </li>`
    });
    list.innerHTML = str;
};


// (3)tab切換(CSS樣式)
let tab = document.querySelector("#tab")
let toggleStatus = "all"; // (1)給tab切換一個預設狀態; 當同樣的東西, 有多的狀態, 最好給個預設值?
tab.addEventListener("click", task)
function task (event){
    toggleStatus = event.target.dataset.tab; // (2)dataset跟data-tab有關, 但為什麼後面.tab???
    let tabs = document.querySelectorAll("#tab li"); // (3)抓tab裡面的所有li
    tabs.forEach((item, index) => {
        item.classList.remove("active"); // (4)讓ul跑forEach, 刪除所有active之底線
    });
    event.target.classList.add("active"); // (5)刪除完active, 再增加active

    done_list();
}


// (4)刪除 & 切換 checked 狀態功能
list.addEventListener("click", delAndChecked); // (1)刪除為ul li裡面的功能, 因此監聽ul
function delAndChecked (event){
    let id = event.target.closest("li").dataset.id // (2)因為此樣板點擊不到li, 因此要用closest去找;
    if(event.target.classList.value === "delete"){
        event.preventDefault();
        // (3)不懂箭頭函式這裡, 放{}, 按刪除=全刪除; 不懂嚴格不相等!==, 沒辦法執行不相等
        todo_Arr = todo_Arr.filter((item) => item.id != id); 
    }else{
        // 切換 checked狀態功能
        todo_Arr.forEach((item, index) => {
            if(item.id == id){  // (0)若用嚴格相等, 是無法做到checked????
                if(todo_Arr[index].checked === "checked"){
                    todo_Arr[index].checked = ""; // (1)不懂為何這裡checked = "" ???
                }else{
                    todo_Arr[index].checked = "checked"; // (2)相反, 則上checked狀態???
                };
            }
        })
    };
    // render();
    done_list();
}


// (5)更新「待完成項目」
function done_list(){
    let done_element = [];
    if(toggleStatus === "all"){
        done_element = todo_Arr;
    }else if(toggleStatus === "notDone"){
        done_element = todo_Arr.filter((item) =>item.checked === ""
        // (1)未完成, 於checked標上空字串
        // (2)箭頭函式若加上{}, 待完成&已完成, inputText.value字串不會被渲染!!!
        );
    }else{
        done_element = todo_Arr.filter((item) => item.checked === "checked"
        // (2)已完成, 於checked標上"done"
        // (2)箭頭函式若加上{}, 待完成&已完成, inputText.value字串不會被渲染!!!
        );
    };

    let notDone_Num = document.querySelector("#notDone_Num");
    let notDone_Length = todo_Arr.filter((item) => item.checked === "");
    // (3)這邊若加上{}, 永遠都是「0」個待完成
    notDone_Num.textContent = notDone_Length.length;
    render(done_element);
};

// 初始
// (1)不懂為何要初始??? 渲染一開始 toggleStatus = all ??? 
// (2)也把所有render()改成done_list?
done_list();


// (6)刪除已完成 todo
let del_Done = document.querySelector("#del_Done");
del_Done.addEventListener("click", function(event){
    event.preventDefault();
    todo_Arr = todo_Arr.filter((item) => item.checked === "");
    // (0)箭頭函: 按下清除全部之前, filter把checked屬性, 變成"", 也就等同消失於清單上 
    // (1)為何箭頭函式放{}, 變成全刪???
    done_list();
})


// (7) 優化, 按Enter即可啟動 新增
inputText.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        buttonAdd();
    }
});


