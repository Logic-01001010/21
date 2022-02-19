import React from 'react';
import './style/Main.css';
import $ from 'jquery';



var items_array = [];

class item{
    constructor(serial, contents, start, end, latest){
        this.serial = serial;
        this.contents = contents;
        this.start = start;
        this.end = end;
        this.latest = latest;
    }
}



$(document).ready(function(){

    if( localStorage.getItem('items') != null && localStorage.getItem('items') != undefined  && localStorage.getItem('items') != '' && localStorage.getItem('items') != '[]' ){
        var temp_items_array = JSON.parse( localStorage.getItem('items') );

        for(var idx=0; idx<temp_items_array.length; idx++){
            temp_items_array[idx].start = new Date( temp_items_array[idx].start );
            temp_items_array[idx].end = new Date( temp_items_array[idx].end );
            temp_items_array[idx].latest = new Date( temp_items_array[idx].latest );
        }

        items_array = temp_items_array;
    
    }


    rendering();

    // 렌더링
    function rendering(){

        $('.list_box').text(null);

        var idx = 0;

        for( var item of items_array ){
            
            var serial = item.serial;
            var contents = item.contents;
            var start = item.start;
            var end = item.end;
            var latest = item.latest;

            var start_date = start.getFullYear()+'-'.concat( ( (start.getMonth() + 1) < 10 ) ? ( '0' + ( start.getMonth() + 1 ) ) : ( ( start.getMonth() + 1 ) ) ) + '-'.concat( ( (start.getDate()) < 10 ) ? ( '0' + ( start.getDate() ) ) : ( ( start.getDate() ) ) );
            var end_date = end.getFullYear()+'-'.concat( ( (end.getMonth() + 1) < 10 ) ? ( '0' + ( end.getMonth() + 1 ) ) : ( ( end.getMonth() + 1 ) ) ) + '-'.concat( ( (end.getDate()) < 10 ) ? ( '0' + ( end.getDate() ) ) : ( ( end.getDate() ) ) );

            
            var today = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
            end = new Date( end.getFullYear(), end.getMonth(), end.getDate() );
                       
            var difference= Math.abs(end-today);
            var days = difference/(1000 * 3600 * 24)
            
            days += serial;
            
    
            if( days <= 20 && serial !== 21 ){ // 목표 실패

                $('.list_box').append(`
                    <div class='item failed' idx=${idx}>
                    <div class='count'>${serial}</div>
                    <div class='contents'>${contents}</div>
                    <div class='date'>${start_date} ~ ${end_date}</div>
                    <div class='extra hide'><div class='btn hide'>더보기</div><div class='more'>
                        <span class='modify'>수정</span>
                        <span class='delete'>삭제</span>
                    </div>
                    </div>
                </div>`
                )
            }   
            else if( serial >= 21 ){ // 목표 달성
                $('.list_box').append(`
                    <div class='item success_' idx=${idx}>
                    <div class='count'>${serial}</div>
                    <div class='contents'>${contents}</div>
                    <div class='date'>${start_date} ~ ${end_date}</div>
                    <div class='extra hide'><div class='btn hide'>더보기</div><div class='more'>
                        <span class='modify'>수정</span>
                        <span class='delete'>삭제</span>
                    </div>
                    </div>
                </div>`
                )                         
            }
            else if( Math.floor( days ) >= 22  ){ // 하루 목표 달성
                $('.list_box').append(`
                    <div class='item check' idx=${idx}>
                    <div class='count'>${serial}</div>
                    <div class='contents'>${contents}</div>
                    <div class='date'>${start_date} ~ ${end_date}</div>
                    <div class='extra'><div class='btn hide'>더보기</div><div class='more'>
                        <span class='success'>하루 목표 달성</span>
                        <span class='modify'>수정</span>
                        <span class='delete'>삭제</span>
                    </div>
                    </div>
                </div>`
                )
            }
             else { // 목표 진행중

                $('.list_box').append(`
                    <div class='item' idx=${idx}>
                    <div class='count'>${serial}</div>
                    <div class='contents'>${contents}</div>
                    <div class='date'>${start_date} ~ ${end_date}</div>
                    <div class='extra hide'><div class='btn hide'>더보기</div><div class='more'>
                        <span class='success'>하루 목표 달성</span>
                        <span class='modify'>수정</span>
                        <span class='delete'>삭제</span>
                    </div>
                    </div>
                </div>`
                )

            }

            idx += 1;
        }

    }

    var extraEvent = ()=>{

        localStorage.setItem('items', JSON.stringify(items_array)); // 웹 스토리지에 배열 저장


        // 하루 성공
        $('.success').on('click', (e)=>{
            if( window.confirm("오늘 하루의 실천을 완료하셨나요?") !== true ){
                return null;
            }
            var idx = $(e.target).parent().parent().parent().attr('idx');
            var serial = items_array[idx].serial;
            var end = items_array[idx].end;

            var today = new Date( new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
            end = new Date( end.getFullYear(), end.getMonth(), end.getDate() );
                       
            var difference= Math.abs(end-today);
            var days = difference/(1000 * 3600 * 24)
            
            days += serial;
            
            console.log(serial);
            
            if( Math.floor( days ) >= 22  ){
                alert('이미 오늘 할 일을 다 마쳤습니다.');
                return null;
            }
            else if( serial === 20 ){
                $('body').append(`<div class='effect dayclear'></div>`)
                setTimeout( ()=>{ $('.effect.dayclear').remove() }, 3000)                
                $('body').append(`<div class='effect allclear'></div>`)
                setTimeout( ()=>{ $('.effect.allclear').remove() }, 3000)    
            }
            else {
                $('body').append(`<div class='effect dayclear'></div>`)
                setTimeout( ()=>{ $('.effect.dayclear').remove() }, 1800)
            }

            items_array[idx].serial += 1;
            rendering();
            extraEvent();
        })        

        $('.extra .btn').on('click', ( e )=>{
            if( $(e.target).attr('class') === 'btn hide' ){
                $(e.target).text('숨기기');
                $(e.target).removeClass('hide');
            } else{
                $(e.target).text('더보기');
                $(e.target).addClass('hide');
            }

            var extras = $('.extra .btn');
            for( var extra of extras ){
                if( extra !== e.target )
                    $(extra).addClass('hide');
            }

        })
        
        $('.delete').on('click', (e)=>{
            if(window.confirm('해당 목표를 삭제하시겠습니까?')){
                var idx = $(e.target).parent().parent().parent().attr('idx');
                items_array.splice(idx, 1);
                rendering();
                extraEvent();
            }
        })

        $('.modify').on('click', (e)=>{
            var idx = $(e.target).parent().parent().parent().attr('idx');
            var contents = prompt("내용을 입력해주세요.", items_array[idx].contents);
            if( contents) items_array[idx].contents = contents;
            rendering();
            extraEvent();
        })

    }
    extraEvent();

    function registry(){
        var serial = 0;
        var contents = $('.inputContents').val();

        if(contents == null || contents === ''){
            alert('내용을 넣어주세요.')
            return null;
        }

        var start = new Date();
        var end = new Date();
        end.setDate( end.getDate() + 21 );
        var latest = start;
    

        var new_item = new item(serial, contents, start, end, latest);
    
        items_array.push( new_item );
    
        rendering();
        extraEvent();    
    }


    // 추가
    $('.add').on('click', ()=>{
        registry();
        $('.inputContents').val(null);
    })

    $('input').keydown( (key)=>{
        if(key.keyCode === 13){
            registry();
            $('.inputContents').val(null);
        }
    } )

    $('.copy').on('click', ()=>{
        var savefile = JSON.stringify(items_array);
        if ( prompt("아래의 세이브 양식을 복사합니다.", savefile ) ){
            var tempElem = document.createElement('textarea');
            tempElem.value = savefile;  
            document.body.appendChild(tempElem);
          
            tempElem.select();
            document.execCommand("copy");
            document.body.removeChild(tempElem);
        }

        
    })

    $('.load').on('click', ()=>{
        var savefile;
        try{

            
            if( savefile = prompt("복사한 양식을 넣어주세요.") ){

                temp_items_array = JSON.parse( savefile );
                
                for(var idx=0; idx<temp_items_array.length; idx++){
                    temp_items_array[idx].start = new Date( temp_items_array[idx].start );
                    temp_items_array[idx].end = new Date( temp_items_array[idx].end );
                    temp_items_array[idx].latest = new Date( temp_items_array[idx].latest );
                }


                items_array = temp_items_array;

                localStorage.setItem('items', JSON.stringify( temp_items_array )); // 웹 스토리지에 배열 저장

                if( localStorage.getItem('items') != null && localStorage.getItem('items') != undefined  && localStorage.getItem('items') != '' && localStorage.getItem('items') != '[]' ){
                    var temp_items_array = JSON.parse( localStorage.getItem('items') );
            
                    for(var idx=0; idx<temp_items_array.length; idx++){
                        temp_items_array[idx].start = new Date( temp_items_array[idx].start );
                        temp_items_array[idx].end = new Date( temp_items_array[idx].end );
                        temp_items_array[idx].latest = new Date( temp_items_array[idx].latest );
                    }
            
                    items_array = temp_items_array;
                
                }

                rendering();
                extraEvent();    

            }
        } catch(e){
            alert("로드에 문제가 생겼습니다.\n" + e)
        }
    })


});




function Main() {
  return <div className='main'>

      <div className='top'>
          <div className='copy'>copy</div>
          <div className='load'>load</div>
      </div>

        <div className='background'>
            <div className='site_title'>21</div>
        </div>

        <div className='container'>
            <div className='wrapper'>

                <div className='input_box'>
                    <input type="text" className='inputContents'></input>
                    <input type="button" className='add' value="+"></input>
                </div>

                <div className='list_box'>


                </div>

            </div>
        </div>

  </div>;
}

export default Main;
