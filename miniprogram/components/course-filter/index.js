Component({
  properties: {
    courses: {
      type: Array,
      value: [],
      observer: function(newVal) {
        this.setData({
          filteredCourses: newVal
        });
        this.filterCourses();
      }
    }
  },
  data: {
    searchQuery: '',
    filteredCourses: []
  },
  lifetimes: {
    attached() {
      console.log("course-filter=====>","attached",this.data.courses)
      this.setData({
        filteredCourses: this.data.courses
      });
    }
  },
  methods: {
    handleSearchInput(event) {
      const searchQuery = event.detail.value.toLowerCase();
      console.log("searchQuery====>",searchQuery)
      this.setData({ searchQuery }, this.filterCourses);
    },
    filterCourses() {
      const filteredCourses = this.data.courses.filter(course =>
        course.name.toLowerCase().includes(this.data.searchQuery)
      );
      this.setData({ filteredCourses });
    },
    handleCardTap(event) {
      const { id } = event.currentTarget.dataset;
      this.triggerEvent('cardtap', { id });
    }
  }
});
