import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from "date-fns"
import { cn } from "../../lib/utils"

const Calendar = ({ selectedDate, onDateSelect, completedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = React.useState(selectedDate || new Date())

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate)
    }
  }, [selectedDate])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const isCompleted = (date) => {
    return completedDates.some(d => isSameDay(new Date(d), date))
  }

  return (
    <div className="rounded-lg border bg-card p-3 md:p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={previousMonth}
          className="p-1.5 hover:bg-accent rounded-md transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
        </button>
        <h3 className="text-base md:text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 hover:bg-accent rounded-md transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1.5">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-center text-xs md:text-sm font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCompletedDay = isCompleted(day)
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={idx}
              onClick={() => onDateSelect && onDateSelect(day)}
              className={cn(
                "aspect-square p-0.5 text-xs md:text-sm rounded-md transition-colors min-h-[32px] md:min-h-[36px]",
                !isCurrentMonth && "text-muted-foreground opacity-50",
                isSelected && "bg-primary text-primary-foreground font-semibold",
                !isSelected && isCurrentMonth && "hover:bg-accent",
                isToday && !isSelected && "ring-1 md:ring-2 ring-primary"
              )}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="leading-none">{format(day, "d")}</span>
                {isCompletedDay && (
                  <span className="w-1 h-1 rounded-full bg-primary mt-0.5" />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }

