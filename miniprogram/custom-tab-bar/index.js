import TabMenu from './data';
Component({
  data: {
    active: -1,
    list: TabMenu,
  },
  lifetimes: {
    attached() {
      
    }
  },

  methods: {
    onChange(event) {
      console.log(event)
      this.toPage(event);
    },
    toPage(event){
      const { value } = event.detail;
      const targetUrl = `/${this.data.list[value].url}`;
      this.setData({ active: value },()=>{
        wx.switchTab({
          url: targetUrl,
        })
      });
    },
  },
});
