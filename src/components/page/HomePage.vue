<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i> 商品信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="center">
            <el-row type="flex" justify="center">
                <el-col :span="24">
                    <div>
                        <img src="../../assets/base.jpg"/>
                        <el-popover
                            ref="popover2"
                            placement="bottom"
                            title="标题"
                            width="200"
                            trigger="click"
                            content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                        </el-popover>
                        <el-button v-popover="popover2">click 激活</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    export default {
        data: function () {
            return {
            }
        }
    }
</script>

<style scoped>
    .center {
        width: 960px;
        margin-top: 150px;
    }
</style>
