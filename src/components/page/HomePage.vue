<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 商品信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row>
            <el-col :span="8">
                <el-card :body-style="{ padding: '0px' }">
                    <img src="../../assets/base.jpg"/>
                    <div style="padding: 14px;">
                        <span>白酒</span>
                        <div class="bottom clearfix">
                            <el-button type="text" @click="imgclick">显示</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            title="详细信息"
            :visible.sync="centerDialogVisible" width="20px">
            <img src="../../assets/detail.png" @click="detailclick" class="center"/>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                centerDialogVisible: false
            }
        },
        methods: {
            imgclick() {
                this.centerDialogVisible = true;
            },
            detailclick() {
                this.centerDialogVisible = false;
            }
        }
    }
</script>

<style scoped>
    .center {
        width: 900px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
