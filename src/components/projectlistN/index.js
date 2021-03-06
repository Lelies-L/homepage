/**
 * Copyright (c) 2020 Intelligent Software Research Center of ISCAS
 * Summer 2020 Homepage is licensed under Mulan PSL v2.
 * You can use this software according to the terms and conditions of the Mulan PSL v2.
 * You may obtain a copy of Mulan PSL v2 at:
 *          http://license.coscl.org.cn/MulanPSL2
 * THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
 * MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
 * See the Mulan PSL v2 for more details.
 */

import React from 'react'
import './index.less';
import { connect } from 'react-redux';
import { Input } from 'antd';
import proData from '../../data/proList.json';
import projectlist from '../../data/projectlist.json';
import { Pagination } from 'antd';
import { getSelectM,getSelectLang,getSelectDToChi,getLangDToChi} from './util.js'
import {getSplit,gohash,getSupportLanguage,gourl} from "../../util/url.js";
const { Search } = Input;

class ProjectlistN extends React.Component{
    constructor(props){
       super(props)
       this.state ={   
           page:1,
           pagesize:40,
           datall: proData,        // 显示的project所有数据
           searchdatastock:[],      
           datastock:proData,      // project 所有数据
           projectlistdata:[],     // 单页显示的project数据
           degreeselect:"all",
           langSelect: "all",           //0,1,2
           techSelect:"all",
           areaSelect:"all"
       }
       this.itemRender = this.itemRender.bind(this)
    }

   



    componentDidMount(){         
        this.getData()   
    }

    getPageData(page){
        this.setState({
            page:page,
            projectlistdata:this.state.datall.slice(this.state.pagesize*(page-1),this.state.pagesize*page),       
        })  
    }

    filterItem(value){  
        this.setState({ 
            degreeselect:"all" ,
            langSelect: "all"          
        })
        if(value){
            var showdataTemp = []
            const valuel = value.toLowerCase()
            this.state.datall.map((item)=>{           
                if(item.name.toLowerCase().includes(valuel)||
                item.label.includes(valuel)){
                    showdataTemp.push(item)
                }
                return 0;
            })           
            this.setState({
                datall:showdataTemp,
                searchdatastock:showdataTemp,
                page:1,
                
            })
        }else{
           
            this.setState({
                datall:this.state.datastock,  
                searchdatastock:[], 
                degreeselect:"all"           
            })

        }       
        setTimeout(()=>{
            this.getPageData(1)
        },100)
        
        
        return 0;
    }


    getData(){
        this.setState({
            projectlistdata:this.state.datall.slice(0,this.state.pagesize),
        })
        
    }

    itemRender(current, type, originalElement) {
        if(this.props.chiFlag === "chi"){
            if (type === 'prev') {
                return <a>上一页</a>;
            }
            if (type === 'next') {
            return <a>下一页</a>;
            }

        }else{
            if (type === 'prev') {
                return <a>Previous</a>;
              }
              if (type === 'next') {
                return <a>Next</a>;
              }
        }
        
        return originalElement;
      }

    onChange = page => {
        this.getPageData(page)
    };

    gohashlink(orgtitle,proid){
        let url = "/org/orgdetail/"+orgtitle
        if(proid){
            url += "/proid"+proid
        }
        gohash(url)
        this.props.setOrgTabFlag("orglist")
    }


    filterTag(tag,flag){ 
        // 1.0 获取选择标签的值
        let {degreeselect,langSelect} = this.state
        degreeselect = flag === "degree" ? tag : degreeselect
        langSelect = flag === "lang" ? tag : langSelect
        // 2.0 定义筛选出的数据数组
        let filterdata = [] 
        // 3.0 确定搜索的数组源
        let showdatastock = "datastock"
        if(this.state.searchdatastock.length>0){
            showdatastock = "searchdatastock"
        }
            
        // debugger
        if( degreeselect=== "all" && langSelect === "all"){
            this.setState({
                datall:this.state[showdatastock],              
            })
        }else{
            
            const degree = getSelectDToChi(degreeselect)
            const langnum = getLangDToChi(langSelect)

            filterdata = this.state[showdatastock].filter(item => {
                if(degreeselect=== "all"){
                    return item.spl === langnum
                }else if(langSelect=== "all"){
                    return  item.difficulty === degree
                }else{
                    return item.spl === langnum && item.difficulty === degree
                }
                
            });
            
        
            this.setState({
                datall:filterdata,              
            })
        }
        

        setTimeout(()=>{
            this.getPageData(1)
        },100)
    }
    setDegree(tag){
        const tagen = getSelectM(tag)
        this.setState({
            degreeselect:tagen
        })
        this.filterTag(tagen,"degree")
    }

    setLang(item){
        
        const langtag = getSelectLang(item)
        this.setState({
            langSelect:langtag
        })
        this.filterTag(langtag,"lang")
    }

    


    getDegreeBy(degree){
        if(this.props.chiFlag === "chi"){
            return degree
        }
        return {
            "高":"High",
            "中":"Medium",
            "低":"Low"
        }[degree]||"Low"
    }

    


    render(){
        
        let showdata = projectlist[this.props.chiFlag]
        let {projectlistdata,degreeselect,langSelect,datall} = this.state
        let datalllength = datall.length
        return(         
            <div className="Projectlist">
               <div className="ProjectListBanner">
                <Search                      
                        placeholder={showdata.searchPlaceholder}
                        allowClear
                        size="large"
                        onSearch={value => this.filterItem(value)}
                    />
                    {/* 功能未上线 */}
                    {/* <div className="ProjectListRank">
                        <span 
                            onClick={()=>{this.TabSelectOrder("community")}}
                            className={["ProjectListRankItem",this.state.orderSelect === "community"?"selectOrder":""].join(" ")}>
                                {showdata.order[0]}</span>
                        <span 
                            onClick={()=>{this.TabSelectOrder("proid")}}
                            className={["ProjectListRankItem",this.state.orderSelect === "proid"?"selectOrder":""].join(" ")}>
                                {showdata.order[1]}</span>
                    </div>            
                    */}
               </div> 
               <div className="projectListWrapper content1200">
                    <div className="ProjectListPageState">
                        <div className="ProjectListPage">
                            <span className="ProjectListPageItemOne">{showdata.pronum[0]} {datalllength} {showdata.pronum[1]}</span>
                            <span className="ProjectListPageItem">
                                {showdata.pagenum[0]}{this.state.page} {showdata.pagenum[1]} 
                                <span className="ProjectListPageItemSum">{showdata.pagesum[0]} {Math.ceil(datalllength/this.state.pagesize)} {showdata.pagesum[1]}</span>
                            </span>
                        </div>
                        {/* <div className="ProjectListApplyState">{showdata.applyState[2]}</div> */}
                    </div>
                    <div className="ProjectListSelect">
                        <div className="ProjectListSelectItem Degree">
                            <span className="ProjectListSelectItemTitle" >{showdata.proDi}</span>
                            {
                                showdata.prodegree.map((item,index)=>{
                                    return (
                                        <span 
                                        key={index} 
                                        onClick={()=>{this.setDegree(item)}}
                                        className={["ProjectListSelectItemContent",getSelectM(item) === degreeselect ? "ProjectListSelectTagDe":""].join(" ")}>
                                            {item}
                                        </span>
                                    )
                                })
                            }
                        </div>
                        <div className="ProjectListSelectItem Lang">
                            <span className="ProjectListSelectItemTitle" >{showdata.lang}</span>
                            {
                                showdata.langtag.map((item,index)=>{
                                    return (
                                        <span 
                                        key={index} 
                                        onClick={()=>{this.setLang(item)}}
                                        className={["ProjectListSelectItemContent",getSelectLang(item) === langSelect ? "ProjectListSelectTagDe":""].join(" ")}>
                                            {item}
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="ProjectListLCWrapper">
                    <div className="ProjectListLC">
                        <div className="ProjectListLCLine Header">
                            <span className="ProjectListLCID ">{showdata.projectNumber}</span>
                            <span className="ProjectListLCName">{showdata.projectName}</span>
                            <span className="ProjectListLCCommunity">{showdata.projectCommunity}</span>
                            <span className="ProjectListLCLang">{showdata.language}</span>
                            <span className="ProjectListLCDegree">{showdata.proDegree}</span>
                            <span className="ProjectListLCOperation">{showdata.operation}</span>
                        </div>
                       

                        {
                          
                                         
                                projectlistdata.map((item,index)=>{
                                    return(
                                        <div className="ProjectListLCLine Item" key={index}>
                                            <span className="ProjectListLCID ">{item.label}</span>
                                            <span className="ProjectListLCName" onClick={()=>{this.gohashlink(item.organchor,item.label)}}>
                                                
                                                {getSplit( item.name,this.props.chiFlag)}
                                            </span>
                                            <span className="ProjectListLCCommunity" onClick={()=>{this.gohashlink(item.organchor)}}>
                                                {getSplit( item.orgname,this.props.chiFlag)}</span>
                                            <span className="ProjectListLCLang">{getSupportLanguage(item.spl)}</span>
                                            <span className="ProjectListLCDegree">{this.getDegreeBy(item.difficulty)}</span>
                                            <span className="ProjectListLCOperation Item">
                                                
                                                <span className="PLOperationButton prodetail" onClick={()=>{this.gohashlink(item.organchor,item.label)}}>{showdata.operationbutton[0]}</span>
                                                <span className="PLOperationButton proapply">{showdata.operationbutton[1]}</span>
                                            </span>
                                        </div>
                                    )
    
                                })
                          
                            
                        }
                        
                      

                    </div>
                    </div>
                    <Pagination 
                    current={this.state.page}
                    defaultPageSize ={this.state.pagesize} 
                    total={datalllength} 
                    itemRender={this.itemRender}
                    onChange={this.onChange}
                    showSizeChanger={false}
                    /> 

               </div>
               
               
              
               

            </div>
         )
       
        
        
    }
}

const mapStateToProps = (state)=>{

    return {
       chiFlag:state.chiFlag
   }
 }

 const mapDispatchToProps = dispatch => {
    return {
        setOrgTabFlag:(data)=>{
            dispatch({
                type:'setOrgTabFlag',
                payload:data
            })
        }
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(ProjectlistN)