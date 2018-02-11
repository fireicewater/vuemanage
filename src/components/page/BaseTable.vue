<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> admin</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" class="handle-del mr10" @click="searchformdialog">搜索</el-button>
            <el-button type="primary" class="handle-del mr10" @click="createformdialog">增加</el-button>
            <el-button type="primary" class="handle-del mr10" @click="update">修改</el-button>
            <el-button type="primary" class="handle-del mr10" @click="deleteuser">删除</el-button>
            <el-button type="primary" class="handle-del mr10" @click="delAll">批量删除</el-button>
            <el-button type="primary" class="handle-del mr10" @click="changpassword">重置密码</el-button>
            <el-button type="primary" class="handle-del mr10" @click="remittance">汇款</el-button>
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
            <el-table-column prop="salesamount" label="购买金额" width="120"></el-table-column>
            <el-table-column prop="salesman" label="销售人员" width="120"></el-table-column>
            <el-table-column prop="createtime" label="日期" sortable width="150"></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change="handlePageCurrentChange"
                layout="prev, pager, next"
                :total="count"
                :page-size="15"
            >
            </el-pagination>
        </div>
        <el-dialog title="新增用户" :visible.sync="creatFormVisible" fullscreen="true">
            <el-form :model="creatform" ref="creatform" :rules="createformrules">
                <el-input v-model="creatform.id" type="hidden"></el-input>
                <template v-if="isupdate">
                    <el-form-item label="用户名">
                        <el-input v-model="creatform.username" :disabled="isupdate"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="creatform.username"></el-input>
                    </el-form-item>
                </template>
                <template v-if="!isupdate">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="creatform.password"></el-input>
                    </el-form-item>
                </template>
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
            <el-form :model="remittanceform" :rules="remittanceformrules" ref="remittanceform">
                <el-form-item label="汇款金额" prop="amount">
                    <el-input v-model="remittanceform.amount" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="remittanceFormcancel">取 消</el-button>
                <el-button type="primary" @click="remittanceFormconfirm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="搜索" :visible.sync="searchformVisible">
            <el-form :model="searchform" ref="seaechform" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="searchform.username"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="searchform.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="searchform.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="searchform.mobile"></el-input>
                </el-form-item>
                <el-form-item label="支付方式" prop="paymethod">
                    <el-input v-model="searchform.paymethod"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号" prop="cardno">
                    <el-input v-model="searchform.cardno"></el-input>
                </el-form-item>
                <el-form-item label="支付宝" prop="alipay">
                    <el-input v-model="searchform.alipay"></el-input>
                </el-form-item>
                <el-form-item label="销售金额" prop="salesamount">
                    <el-input v-model="searchform.minsalesamount">
                        <template slot="prepend">大于:</template>
                    </el-input>
                    <el-input v-model="searchform.maxsalesamount">
                        <template slot="prepend">小于:</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售人员" prop="salesman">
                    <el-input v-model="searchform.salesman"></el-input>
                </el-form-item>
                <el-form-item label="创建时间">
                    <el-date-picker
                        v-model="searchform.createtime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchformconfirm">搜索</el-button>
                    <el-button type="primary" class="handle-del mr10" @click="searchformcancel">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import auth from "../../auth"
    export default {
        http: {
            root: '/root',
            headers: auth.getAuthHeader()
        },
        data() {
            var validatuser = (rule, value, callback) => {
                this.$http.get("/user/validateuser", {params: {username: value}})
                    .then(response => {
                        if (response.status === 200) {
                            let code = response.body.code;
                            if (code === 200) {
                                callback(new Error('用户名已存在'));
                            } else {
                                callback();
                            }
                        }
                    }, response => {
                        if (response.status === 404) {
                        }
                    });
            };
            return {
                url: './static/vuetable.json',
                //当前选中row
                currentRow: null,
                isupdate: false,
                //表格数据
                tableData: [],
                //当前页
                cur_page: 1,
                count: 0,
                //多选数据
                multipleSelection: [],
                //是否显示新增表单
                creatFormVisible: false,
                remittanceFormVisible: false,
                searchformVisible: false,
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
                searchform: {
                    username: "",
                    password: "",
                    name: "",
                    sex: "",
                    mobile: "",
                    paymethod: "",
                    cardno: "",
                    alipay: "",
                    minsalesamount: '',
                    maxsalesamount: '',
                    salesman: "",
                    createtime: []
                },
                remittanceform: {
                    userid: "",
                    amount: ""
                },
                remittanceformrules: {
                    amount: [
                        {type: "string", required: true, message: '请输入汇款金额', trigger: 'blur'},
                        {
                            pattern: /^(([1-9][0-9]*)|(([0]\.\d{0,2}|[1-9][0-9]*\.\d{0,2})))$/,
                            message: '请输入正确金额',
                            trigger: 'blur'
                        },
                    ],
                },
                createformrules: {
                    username: [
                        {type: "string", required: true, message: '请输入用户名', trigger: 'blur'},
                        {validator: validatuser, trigger: 'blur'}

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
                if (value) {
                    let formattedValue = value.trim().slice(0, value.indexOf('.') === -1 ? value.length : value.indexOf('.') + 3)
                    // 如果值尚不合规，则手动覆盖为合规的值
                    let result = parseFloat(formattedValue).toFixed(2);
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
                let param = this.searchform
                let creatime = param.createtime;
                if (creatime.length > 0) {
                    param.mincreatetime = creatime[0];
                    param.maxcreatetime = creatime[1];
                }
                param.page = this.cur_page
                this.$http.post("/user/getuserlist", param).then(response => {
                    // success callback
                    if (response.status === 200) {
                        let code = response.body.code;
                        if (code === 200) {
                            let data = response.body.body;
                            this.tableData = [];
                            this.tableData = data.list;
                            this.cur_page = data.pageNum;
                            this.count = data.total;
                        }
                        if (code === 404) {
                            this.tableData = [];
                            this.$message.warn("数据未找到")
                        }
                    }
                }, response => {
                    // error callback
                    this.$message.error("服务器错误请稍后再试")
                });
            },
            getsex(row, column) {
                return row.sex === 1 ? "男" : "女"
            },
            //新建用户
            createformdialog() {
                this.isupdate = false;
                this.creatFormVisible = true;
            },
            //新建用户确认
            createformconfirm() {
                let creat = this.creatform
                if (creat.id) {
                    this.$refs['creatform'].validate((valid) => {
                        if (valid) {
                            this.$http.put("/user/updateuser", creat).then(response => {
                                if (response.status === 200) {
                                    let code = response.body.code;
                                    if (code === 200) {
                                        this.$message({
                                            message: '修改成功',
                                            type: 'success'
                                        });
                                        this.getData();
                                        this.creatFormVisible = false;
                                        this.$refs.creatform.resetFields();
                                        this.creatform = {};
                                    }
                                    if (code === 500) {
                                        this.$message.error('修改失败,请稍后重试');
                                        this.creatFormVisible = false;
                                    }
                                    if (code === 403) {
                                        this.$message.error('校验未通过');
                                    }
                                }
                            }, response => {
                                this.$message.error("服务器错误请稍后再试");
                            });
                        } else {
                            this.$message.error("校验未通过");
                            return false;
                        }
                    });
                } else {
                    this.$refs['creatform'].validate((valid) => {
                        if (valid) {
                            this.$http.post("/user/register", creat).then(response => {
                                if (response.status === 200) {
                                    let code = response.body.code;
                                    if (code === 200) {
                                        this.$message({
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                        this.getData();
                                        this.$refs.creatform.resetFields();
                                        this.creatform = {};
                                        this.creatFormVisible = false;
                                    }
                                    if (code === 500) {
                                        this.$message.error('新增失败,请稍后重试');
                                        this.creatFormVisible = false;
                                    }
                                    if (code === 403) {
                                        this.$message.error('校验未通过');
                                    }
                                }
                            }, response => {
                                this.$message.error("服务器错误请稍后再试");
                            });
                        } else {
                            this.$message.error("校验未通过");
                            return false;
                        }
                    });
                }
            },
            //新建用户取消
            createformcancel() {
                this.creatform = {
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
                };
                this.creatFormVisible = false;
            },
            update() {
                this.isupdate = true;
                let row = this.currentRow;
                if (row) {
                    row.sex = row.sex.toString();
                    row.salesamount = row.salesamount.toString();
                    this.creatform = row;
                    this.creatFormVisible = true;
                } else {
                    this.$message({
                        message: '请选择需要修改的用户',
                        type: 'warning'
                    });
                }

                // this.$message.error('修改失败,请稍后重试');
            },
            delAll() {
                let deletets = this.multipleSelection;
                if (deletets.length > 0) {
                    let ids = [];
                    for (let i = 0; i < deletets.length; i++) {
                        let row = deletets[i];
                        ids.push(row.id);
                    }
                    this.$http.post("/user/deleteusers", JSON.stringify(ids)).then(response => {
                        let code = response.body.code;
                        if (code === 200) {
                            this.getData();
                            this.$message({
                                message: '批量删除成功',
                                type: 'success'
                            });

                            this.$refs.multipleTable.clearSelection();
                        }
                        if (code === 500) {
                            this.$message.error('删除失败,请稍后重试');
                        }
                        if (code === 403) {
                            this.$message.error('没有选中用户进行删除');
                        }
                    }, response => {
                        this.$message.error("服务器错误请稍后再试");
                    })
                } else {
                    this.$message({
                        message: '请选择需要批量删除的用户',
                        type: 'warning'
                    });
                }
            },
            deleteuser() {
                let row = this.currentRow;
                if (row) {
                    let id = row.id
                    let ids = []
                    ids.push(id);
                    this.$http.post("/user/deleteusers", JSON.stringify(ids)).then(response => {
                        let code = response.body.code;
                        if (code === 200) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getData();
                        }
                        if (code === 500) {
                            this.$message.error('删除失败,请稍后重试');
                        }
                        if (code === 403) {
                            this.$message.error('没有选中用户进行删除');
                        }
                    }, response => {
                        this.$message.error("服务器错误请稍后再试");
                    })

                } else {
                    this.$message({
                        message: '请选择需要删除的用户',
                        type: 'warning'
                    });
                }
            }, changpassword() {
                let row = this.currentRow;
                if (row) {
                    let id = row.id
                    this.$http.post("/user/resetpassword",
                        {userid: id, password: "123456"}, {emulateJSON: true})
                        .then(response => {
                            let code = response.body.code;
                            if (code === 200) {
                                this.$message({
                                    message: '重置成功',
                                    type: 'success'
                                });
                                this.getData();
                            }
                            if (code === 500) {
                                this.$message.error('重置失败,请稍后重试');
                            }
                            if (code === 403) {
                                this.$message.error('没有选中用户重置');
                            }
                        }, response => {
                            this.$message.error("服务器错误请稍后再试");
                        });
                    this.getData();
                } else {
                    this.$message({
                        message: '请选择需要重置密码的用户',
                        type: 'warning'
                    });
                }
            },
            remittanceFormcancel() {
                this.remittanceform = {
                    userid: "",
                    amount: ""
                };
                this.$refs.remittanceform.resetFields();
                this.remittanceFormVisible = false;
            },
            remittanceFormconfirm() {
                this.remittanceFormVisible = false;
                this.$refs.remittanceform.validate((valid) => {
                    if (valid) {
                        this.$http.post("/amount/addamount", this.remittanceform)
                            .then(response => {
                                let code = response.body.code;
                                if (code === 200) {
                                    this.$message({
                                        message: '汇款成功',
                                        type: 'success'
                                    });
                                }
                                if (code === 500) {
                                    this.$message.error('汇款失败,请稍后重试');
                                    this.creatFormVisible = false;
                                }
                                if (code === 403) {
                                    this.$message.error('没有选中用户汇款');
                                }
                            }, response => {
                                this.$message.error("服务器错误请稍后再试");
                            })
                    } else {
                        this.$message.error('校验未通过');
                        return false;
                    }
                });
                this.$message({
                    message: '汇款成功',
                    type: 'success'
                });
                this.$message.error('汇款失败,请稍后重试');
            },
            remittance() {
                let row = this.currentRow;
                if (row) {
                    this.remittanceform.userid = row.id;
                    this.remittanceFormVisible = true;
                }
                else {
                    this.$message({
                        message: '请选择需要汇款的用户',
                        type: 'warning'
                    });
                }
            },
            searchformdialog() {
                this.searchformVisible = true;
            },
            searchformconfirm() {
                let searchform = this.searchform;
                if (searchform.maxsalesamount !== "") {
                    searchform.maxsalesamount = parseFloat(searchform.maxsalesamount)
                }
                if (searchform.minsalesamount !== "") {
                    searchform.minsalesamount = parseFloat(searchform.minsalesamount)
                }
                this.searchform = searchform;
                this.getData();
                this.searchformVisible = false;
            },
            searchformcancel() {
                this.searchformVisible = false;
            }
        }
    }

    function tofloat(value) {
        if (!value) return ''
        let res = parseFloat(value)
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
