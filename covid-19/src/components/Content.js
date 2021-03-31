import React, { useState, useEffect } from "react";
import { Bar, Doughnet, Line } from "react-chartjs-2";
import axios from "axios";

const Content = () => {
    {/* 데이터를 confirmedData에 넣는다. */}
    const [confirmedData,setConfirmedData] = useState({})
    const [quarantinedData,setQuarantinedData] = useState({})
    //페이지가 마운트되면 바로 정보를 가져오기위해 useEffect사용!
    useEffect(() => {
        const fetchEvents = async () => {
            //코로나 한국현황 api를 res에 담는다.
            const res = await axios.get(
                "https://api.covid19api.com/dayone/country/kr"
            );
            //data를 모두 받아온다음에 그다음 순서를 실행하기 위해, async와 await를 사용한다.
            makeData(res.data)
        };
        const makeData = (items) => {
            const arr = items.reduce((acc,cur)=>{
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const deaths = cur.Deaths;
                const recovered = cur.Recovered;
                
                const findItem = acc.find(a=> a.year === year && a.month === month);
                // 해당 연월에 대한 정보가 있으면, 중복푸시하지 않음.
                if(!findItem){
                    acc.push({
                        year, month, date, confirmed, active, deaths, recovered
                    })
                }
                if(findItem&&findItem.date<date){
                    // 해당 연월에 최신 date 값 받기
                    findItem.active = active;
                    findItem.deaths = deaths;
                    findItem.date = date;
                    findItem.year = year;
                    findItem.month = month;
                    findItem.confirmed = confirmed;
                    findItem.recovered = recovered;
                }
                return acc;
            },[])
            // reduce를 사용하여 반복문을 만든다. acc는 누적값, cur은 현재값이다. 그런 다음 배열로 값을 전달받는다.
            const labels = arr.map(a=>`${a.month+1}월`)
            setConfirmedData({
                labels,
                datasets:[{
                label:"국내 누적 확진자",
                backgroundColor: "#ff7979",
                fill:true,
                data: arr.map(a=>a.confirmed)
            }]
        })
        setQuarantinedData({
            labels,
            datasets:[{
            label:"월별 격리자 현황",
            borderColor: "#badc58",
            fill:false,
            data: arr.map(a=>a.active)
        }]
    })
        }
        fetchEvents();
    });
    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className="content">
                <div>
                    <Bar data={confirmedData} option={{title:{display:true, text:"누적 확진자 추이", fontSize:16}}
                ,{legend:{display:true, position:"bottom"}}}/>
                {/* legend : 그래프가 어떤 내용을 뜻하는지 나타낸다. */}
                <Line data={quarantinedData} option={{title:{display:true, text:"월별 격리자 현황", fontSize:16}}
                ,{legend:{display:true, position:"bottom"}}}/>
                </div>
            </div>
        </section>
    );
};

export default Content;