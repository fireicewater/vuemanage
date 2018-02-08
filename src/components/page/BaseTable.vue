<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> admin</el-breadcrumb-item>
                <el-breadcrumb-item>用户编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" class="handle-del mr10" @click="createformdialog">增加</el-button>
            <el-button type="primary" class="handle-del mr10" @click="update">修改</el-button>
            <el-button type="primary" class="handle-del mr10" @click="deleteuser">删除</el-button>
            <el-button type="primary" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-button type="primary" class="handle-del mr10" @click="changpassword">重置密码</el-button>
            <el-button type="primary" class="handle-del mr10" @click="changpassword">汇款</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" ref="multipleTable"
                  @selection-change="handleSelectionChange" @current-change="handleTableCurrentChange"
                  highlight-current-row
        >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="username" label="账号" width="120"></el-table-column>
            <el-table-column prop="name" label="姓名" width="120"></el-table-column>
            <el-table-column prop="sex" label="性别" width="80" :formatter="getsex"></el-table-column>
            <el-table-column prop="mobile" label="手机号" width="150"></el-table-column>
            <el-table-column prop="paymethod" label="支付方式" width="120"></el-table-column>
            <el-table-column prop="cardno" label="银行卡号" width="120"></el-table-column>
            <el-table-column prop="alipay" label="支付宝" width="120"></el-table-column>
            <el-table-column prop="name" label="购买金额" width="120"></el-table-column>
            <el-table-column prop="salesman" label="销售人员" width="120"></el-table-column>
            <el-table-column prop="date" label="日期" sortable width="150"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change="handlePageCurrentChange"
                layout="prev, pager, next"
                :total="1000">
            </el-pagination>
        </div>
        <el-dialog title="新增用户" :visible.sync="creatFormVisible" fullscreen="true">
            <el-form :model="creatform" ref="creatform" :rules="createformrules">
                <el-input v-model="creatform.id" type="hidden"></el-input>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="creatform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="creatform.password"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="creatform.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="creatform.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="creatform.mobile"></el-input>
                </el-form-item>
                <el-form-item label="支付方式" prop="paymethod">
                    <el-input v-model="creatform.paymethod"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号" prop="cardno">
                    <el-input v-model="creatform.cardno"></el-input>
                </el-form-item>
                <el-form-item label="支付宝" prop="alipay">
                    <el-input v-model="creatform.alipay"></el-input>
                </el-form-item>
                <el-form-item label="销售金额" prop="salesamount">
                    <el-input v-model="creatform.salesamount"></el-input>
                </el-form-item>
                <el-form-item label="销售人员" prop="salesman">
                    <el-input v-model="creatform.salesman"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createformcancel">取 消</el-button>
                <el-button type="primary" @click="createformconfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="汇款" :visible.sync="remittanceFormVisible">
            <el-form :model="form">
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                //当前选中row
                currentRow: null,
                //表格数据
                tableData: [],
                //当前页
                cur_page: 1,
                //多选数据
                multipleSelection: [],
                //是否显示新增表单
                creatFormVisible: false,
                remittanceFormVisible: false,
                creatform: {
                    id: null,
                    username: "",
                    password: "",
                    name: "",
                    sex: "1",
                    mobile: "",
                    paymethod: "",
                    cardno: "",
                    alipay: "",
                    salesamount: '',
                    salesman: ""
                },
                changpasswordform: {
                    id: null,
                    username: "",
                    password: "",
                    newpassword: "",
                    repassword: ""
                },
                createformrules: {
                    username: [
                        {type: "string", required: true, message: '请输入用户名', trigger: 'blur'},
                        {
                            validator(rule, value, callback, source, options) {
                                var errors = [];
                                // test if email address already exists in a database
                                // and add a validation error to the errors array if it does
                                errors.push(new Error("用户名已存在"));
                                callback(errors);
                            }
                        }
                    ],
                    password: [
                        {type: "string", required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    name: [
                        {type: "string", required: true, message: '请输入姓名', trigger: 'blur'},
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                            message: '请输入正确手机号',
                            trigger: 'blur'
                        },
                    ],
                    paymethod: [
                        {type: "string", required: true, message: '请输入支付方式', trigger: 'blur'},
                    ],
                    cardno: [
                        {type: "string", required: true, message: '请输入银行卡号', trigger: 'blur'},
                    ],
                    alipay: [
                        {type: "string", required: true, message: '请输入银支付宝号', trigger: 'blur'},
                    ],
                    salesamount: [
                        {type: "string", required: true, message: '请输入购买金额', trigger: 'blur'},
                        {
                            pattern: /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/,
                            message: '请输入正确金额',
                            trigger: 'blur'
                        },
                    ],
                    salesman: [
                        {type: "string", required: true, message: '请输入销售人员信息', trigger: 'blur'},
                    ]
                },
            }
        },
        created() {
            this.getData();
        },
        computed: {},
        methods: {
            handlePageCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            handleTableCurrentChange(val) {
                //当前的row对象
                this.currentRow = val;
            },
            updateValue: function (value) {
                console.log(value);
                if (value) {
                    const formattedValue = value.trim().slice(0, value.indexOf('.') === -1 ? value.length : value.indexOf('.') + 3)
                    // 如果值尚不合规，则手动覆盖为合规的值
                    const result = parseFloat(formattedValue).toFixed(2);
                    console.log(result)
                    if (!isNaN(result)) {
                        this.creatform.salesamount = result
                    }

                }

            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getData() {
                let self = this;
                self.$axios.get(self.url, {page: self.cur_page}).then((res) => {
                    self.tableData = res.data.list;
                })
            },
            getsex(row, column) {
                return row.sex === 1 ? "男" : "女"
            },
            //新建用户
            createformdialog() {
                this.creatFormVisible = true;
            },
            //新建用户确认
            createformconfirm() {
                const creat = this.creatform;
                if (creat.id) {
                    console.log("update");
                    //TODO ajax 发送请求
                    // self.$axios.post(self.url, {page: self.cur_page}).then((res) => {
                    //     self.tableData = res.data.list;
                    // })
                    this.getData();
                    this.creatFormVisible = false;
                } else {
                    this.$refs['creatform'].validate((valid) => {
                        console.log(valid);
                        if (valid) {
                            alert('submit!');
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                    //TODO ajax 发送请求
                    // self.$axios.post(self.url, {page: self.cur_page}).then((res) => {
                    //     self.tableData = res.data.list;
                    // })
                    // this.getData();
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    });
                    this.$message.error('新增失败,请稍后重试');
                }
                // this.creatFormVisible = false;
                this.creatform = {};
            },
            //新建用户取消
            createformcancel() {
                this.creatFormVisible = false;
                this.creatform = {};
            },
            update() {
                const row = this.currentRow;
                if (row) {
                    this.creatform = row;
                    this.creatFormVisible = true;
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '请选择需要批量删除的用户',
                        type: 'warning'
                    });
                }

                // this.$message.error('修改失败,请稍后重试');
            },
            delAll() {
                const deletets = this.multipleSelection;
                if (deletets.length > 0) {
                    let ids = [];
                    for (let i = 0; i < deletets.length; i++) {
                        let row = deletets[i];
                        ids.push(row.id);
                    }
                    console.log(ids)
                    //TODO ajax调用删除方法
                    this.getData();
                    this.$message({
                        message: '批量删除成功',
                        type: 'success'
                    });

                    this.$refs.multipleTable.clearSelection();
                    // this.$message.error('批量删除失败,请稍后重试');
                } else {
                    this.$message({
                        message: '请选择需要批量删除的用户',
                        type: 'warning'
                    });
                }
            },
            deleteuser() {
                const row = this.currentRow;
                if (row) {
                    const id = row.id
                    //Todo id 删除
                    this.$message({
                        message: '请选择需要批量删除的用户',
                        type: 'success'
                    });
                    this.getData();
                } else {
                    this.$message({
                        message: '请选择需要删除的用户',
                        type: 'warning'
                    });
                }
            },
            changpassword() {
                const row = this.currentRow;
                if (row) {
                    const id = row.id
                    //Todo id 删除
                    this.$message({
                        message: '重置密码成功',
                        type: 'success'
                    });
                    this.getData();
                } else {
                    this.$message({
                        message: '请选择需要重置密码的用户',
                        type: 'warning'
                    });
                }
            }
        }
    }

    function tofloat(value) {
        if (!value) return ''
        const res = parseFloat(value)
        if (isNaN(res)) {
            return value;
        }
        return res.toFixed(2)
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
</style>
