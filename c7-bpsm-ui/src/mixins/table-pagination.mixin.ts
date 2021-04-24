const TablePagination = (itemPerPage: number[] = [10, 25, 50, 100]) => ({
  data: () => ({
    firstIndex: 0,
    itemPerPage,
    lastIndex: 0,
  }),
  methods: {
    pageChange(fIndex: number, lIndex: number) {
      [this.firstIndex, this.lastIndex] = [fIndex, lIndex];
    },
  },
});

export default TablePagination;