<template>
    <div class="add-swiper">
        <el-form :model="formData" class="w500">
            <el-form-item label="轮播图标题">
                <el-input v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="轮播图书籍">
                <el-select v-model="formData.category" @change="categoryChange">
                    <el-option v-for="(item, index) in categoryData"
                    :key="index" :label="item.title" :value="item._id">
                    </el-option>
                </el-select>
                <div class="book-item clearfix" v-if="getBookItem[0]">
                    <div class="img-wrap">
                        <img :src="getBookItem[0].img" class="img">
                    </div>
                    <div class="content">
                        <div class="title">标题：{{getBookItem[0].title}}</div>
                        <div class="author">作者：{{getBookItem[0].author}}</div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="轮播图头图">
                <upload v-model="formData.img" class="fll"></upload>
            </el-form-item>
            <el-form-item label="轮播图排序">
                <el-input-number v-model="formData.index" :min="1"></el-input-number>
            </el-form-item>
        </el-form>

        <el-button type="primary" @click="handleSubmit">提交</el-button>

        <el-dialog title="书籍列表" :visible.sync="isShow">
            <el-table :data="bookData">
                <el-table-column property="title" label="书名" width="150"></el-table-column>
                <el-table-column label="书籍头图" width="120">
                    <template slot-scope="scope">
                        <img :src="scope.row.img" class="img">
                    </template>
                </el-table-column>
                <el-table-column property="author" label="作者"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="handleAdd(scope.row._id)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                formData: {
                    title: '',
                    img: '',
                    book: '',
                    index: '',
                    category: ''
                },
                categoryData: [],
                isShow: false,
                bookData: [],
                bookCount: 0
            }
        },
        methods: {
            getCategory() {
                this.$axios.get('/category').then(res => {
                    console.log(res)
                    this.categoryData = res.data
                })
            },
            async getBookData() {
                const res = await this.$axios.get(`/category/${this.formData.category}/books`)
                console.log(res)
                this.bookData = res.data.books
                this.bookCount = res.count
            },
            categoryChange() {
                this.isShow = true
                this.getBookData()
            },
            handleAdd(id) {
                this.formData.book = id
                this.isShow = false
            },
            handleSubmit() {
                let isCanSubmit = true
                for(let key in this.formData) {
                    if(!this.formData[key]) {
                        isCanSubmit = false
                    }
                }
                if(isCanSubmit) {
                    this.$axios.post('/swiper', this.formData).then(res => {
                        if(res.code == 200) {
                            this.$message.success(res.msg)
                            this.$router.push({ path: 'showswiper'})
                        }
                    })
                } else {
                    this.$message.console.error('缺少必要参数');
                }
            }
        },
        created() {
            this.getCategory()
        },
        computed: {
            getBookItem() {
                if(this.formData.book) {
                    return this.bookData.filter(item => item._id == this.formData.book)
                } else {
                    return []
                }
            }
        }
    }
</script>

<style scoped lang='scss'>
.w500{
    width: 500px;
}
.img{
    width: 80px;
    height: 100px;
}
.book-item{
    margin-top: 20px;
    width: 430px;
    padding: 15px;
    border: 1px solid #999;
    border-radius: 4px;
    .img-wrap{
        float: left;
        width: 100px;
        height: 120px;
        .img{
            display:block;
            width: 100%;
            height: 100%; 
        }
    }
    .content{
        float: left;
        margin-left: 20px;
        .title{
            color: #333;
            font-weight: 700;
            font-size: 15px;
        }
        .author{
            color: #555;
        }
    }
}
.clearfix::after{
    content: '';
    display: block;
    clear: both;
    width: 0;
    height: 0;
}
.fll{
    float: left;
}
</style>