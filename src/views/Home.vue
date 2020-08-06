<template>
  <div class="home">
		<section class="todoapp" id="todos_app">
			<header class="header">
				<h1>todos</h1>
				<input class="new-todo" placeholder="What needs to be done?" @keyup.enter="addItem" v-app-focus>
			</header>
			<!-- This section should be hidden by default and shown when there are todos -->
			<template v-if="items.length">
				<section class="main">
					<input id="toggle-all" class="toggle-all" type="checkbox" v-model="check_all">
					<label for="toggle-all">Mark all as complete</label>
					<ul class="todo-list">
						<!-- These are here just to show the structure of the list items -->
						<!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
						<li v-for="(item,key) in filterItems" :key="key" :class="{completed:item.complete,editing:current_key===key}">
							<div class="view">
								<input class="toggle" type="checkbox" v-model="item.complete">
								<label v-text="item.content" @dblclick="toEdit(key)"></label>
								<button class="destroy" :value="item.id" @click="removeItem(key)"></button>
							</div>
							<input class="edit" v-app-focus="key == current_key" :value="item.content" @keyup.esc="leaveEdit" @blur="confirmEdit(item,$event,key)" @keyup.enter="confirmEdit(item,$event,key)">
						</li>
					</ul>
				</section>
				<!-- This footer should hidden by default and shown when there are todos -->
				<footer class="footer">
					<!-- This should be `0 items left` by default -->
					<span class="todo-count"><strong v-text="remaining"></strong> item{{ remaining == 1 ? '' : 's' }} left</span>
					<!-- Remove this if you don't implement routing -->
					<ul class="filters">
						<li>
							<a :class="{selected : filterHash=='all'}" @click="changeType('all')">All</a>
						</li>
						<li>
							<a :class="{selected : filterHash=='active'}" @click="changeType('active')">Active</a>
						</li>
						<li>
							<a :class="{selected : filterHash=='completed'}" @click="changeType('completed')">Completed</a>
						</li>
					</ul>
					<!-- Hidden if no completed items are left ↓ -->
					<button class="clear-completed" @click="clearCompleted" v-show="items.length>remaining">Clear completed</button>
				</footer>
			</template>
		</section>
		<footer class="info">
			<p>Double-click to edit a todo</p>
			<!-- Remove the below line ↓ -->
			<p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
			<!-- Change this out with your name and url ↓ -->
			<p>Created by <a href="http://todomvc.com">you</a></p>
			<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
		</footer>
  </div>
</template>

<script>
// @ is an alias to /src

const itemKey='app-items';
const itemStorage={
  fetch(){
    var items=localStorage.getItem(itemKey) || '[]'
    return JSON.parse(items);
  },
  save(items){
    localStorage.setItem(itemKey,JSON.stringify(items));
  }
}
export default {
  data(){
    return {
      items:itemStorage.fetch(),
      current_key:'',
      filterHash:'all'
    }
  },
  watch:{
    items:{
      deep:true,
      handler(newValue,old){
        itemStorage.save(newValue);
      }
    }
  },
  computed:{
    filterItems(){
      switch(this.filterHash){
        case 'active' :
          return this.items.filter( item => !item.complete );
          break;
        case 'completed':
          return this.items.filter( item => item.complete );
          break;
        default	:
          return this.items;
          break;
      }
    },
    remaining(){
      var arr=this.items.filter(function(item){
        return !item.complete
      })
      console.log(arr);
      return arr.length;
    },
    check_all:{
      get(){
        return this.remaining==0;
      },
      set(new_value){
        this.items.forEach((item) => {
          item.complete=new_value;
        })
      }
    },
  },
  methods:{
    confirmEdit(item,event,key){
      var content=event.target.value.trim();
      if(!content){
        this.removeItem(key);
        this.current_key=null;
        return ;
      }
      item.content=content;
      this.current_key=null;
    },
    leaveEdit(){
      this.current_key='';
    },
    toEdit(key){
      this.current_key=key;
    },
    clearCompleted(){
      this.items=this.items.filter(item => !item.complete);
    },
    addItem(event){
      var content=event.target.value.trim();
      if(!content.length){
        return ;
      }
      var id=this.items.length+1;
      this.items.push({
        id,
        content,
        complete:false
      })
      event.target.value='';
    },
    removeItem(key){
      this.items.splice(key,1);
    },
    changeType(type){
      this.filterHash=type;
    }
  },
  directives:{
    'app-focus':{
      inserted(el,binding){
        el.focus();
      },
      update(el,binding){
        var reg=binding.value;
        reg ? el.focus() : null;
      }
    }
  }
};
</script>
