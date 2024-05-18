import { Modal } from "react-bootstrap"
import { useContext, useEffect, useState } from "react"
import { ThemeContext } from "../effects/Theme"
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts'

export default function BurnDownChartModal({ currentSprint, tasksCount, completedTasks, show, onClose }) {
    const { theme } = useContext(ThemeContext)

    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const daysCount = currentSprint.duration * 7
        const hoursCount = daysCount * 24
        const perTaskHours = hoursCount / tasksCount

        let currDayCompletedTasks = 0

        let chartDataArr = []

        for (let currDay = 0; currDay < daysCount; currDay++) {

            currDayCompletedTasks = completedTasks.reduce((acc, task) => {
                const taskUpdatedAt = new Date(task.updatedAt)
                const sprintStartDate = new Date(currentSprint.startDate)
                const currDate = new Date(sprintStartDate)
                currDate.setDate(sprintStartDate.getDate() + currDay)
                const endOfCurrDay = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 23, 59, 59, 999);

                if (taskUpdatedAt <= endOfCurrDay) {
                    acc++
                }

                return acc
            }, 0)

            chartDataArr.push({
                day: currDay + 1,
                burndown: hoursCount - currDayCompletedTasks * perTaskHours,
                ideal_burndown: hoursCount - currDay * 24
            })
        }

        console.log("🚀 ~ useEffect ~ chartDataArr:", chartDataArr)

        setChartData(chartDataArr)
    }, [completedTasks, currentSprint.duration, currentSprint.startDate, tasksCount])

    return (
        <Modal
            show={ show }
            onHide={ onClose }
            className={ `${theme}` }
        >
            <Modal.Header closeButton>
                <Modal.Title>Burndown Chart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center">
                    <TransformWrapper>
                        <TransformComponent>
                            <LineChart
                                width={ 400 }
                                height={ 400 }
                                data={ chartData }
                                margin={ { top: 5, right: 30, left: 20, bottom: 5 } }
                            >
                                <CartesianGrid strokeDasharray="5 5" fill='white' />
                                <Line type="linear" dataKey="burndown" stroke="red" strokeWidth={ 2 } name="actual_burndown" />
                                <Line type="linear" dataKey="ideal_burndown" stroke="green" strokeWidth={ 2 } name="ideal_burndown" />
                                <XAxis dataKey="day" stroke="green">
                                    <Label value="Day" dy={ 15 } position="insideRight" />
                                </XAxis>
                                <YAxis dataKey="ideal_burndown" stroke="green">
                                    <Label value="Hours" dx={ -15 } position="insideBottom" />
                                </YAxis>
                                <Tooltip />
                                <Legend />
                            </LineChart>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            </Modal.Body>
        </Modal>
    )
}
