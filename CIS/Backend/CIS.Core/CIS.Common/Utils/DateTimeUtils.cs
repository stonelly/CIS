using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Common.Utils
{
    /// <summary>
    /// Date Time Utilities class
    /// </summary>
    public static class DateTimeUtils
    {
        public const string DATEPICKER_MONTH_YEAR_FORMAT = "MM/YYYY";
        public const string DATEPICKER_FORMAT = "YYYY-MM-DD";
        public const string DATEPICKER_TEXTBOX_FORMAT = "{0:yyyy-MM-dd}";
        public const string DATEPICKER_PLACEHOLDER_FORMAT = "yyyy-MM-dd";
        public const string DATERANGEPICKER_FORMAT = "YYYY-MM-DD";
        public const string DATETIMEPICKER_FORMAT = "YYYY-MM-DD h:mm A";
        public const string DATETIMEPICKER_TEXTBOX_FORMAT = "{0:yyyy-MM-dd h:mm tt}";

        public const string STANDARD_DATE_FORMAT = "yyyy-MM-dd";
        public const string STANDARD_DATETIME_FORMAT = "yyyy-MM-dd h:mm tt";
        public const string STANDARD_DATETIME_FORMAT_WITH_SECONDS = "yyyy-MM-dd h:mm:ss tt";
        public const string STANDARD_DATETIME_FORMAT_WITH_NO_SECONDS = "yyyy-MM-dd h:mm tt";
        public const string STANDARD_TIME_FORMAT_WITH_SECONDS = "h:mm:ss tt";
        public const string STANDARD_TIME_FORMAT_WITH_NO_SECONDS = "h:mm tt";

        /// <summary>
        /// Return fake date time if it is set, else return actual datetime
        /// </summary>
        /// <returns></returns>
        public static DateTime GetCurrentDateTime()
        {
            //string strDateTime = ConfigurationManager.AppSettings[Constants.SettingKeys.FakeDateTime];

            //if (!string.IsNullOrEmpty(strDateTime))
            //{
            //    return DataTypeUtils.SaveConvert(strDateTime, DateTime.Now);
            //}
            //else
            //{
                return DateTime.Now;
            //}
        }

        /// <summary>
        /// Get Date Time by Time Zone, get Time Zone configuration value from web/app.config
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        //public static DateTime GetDateTimeWithTimeZone(DateTime dateTime)
        //{
        //    string timeZoneID = ConfigurationManager.AppSettings[Constants.SettingKeys.CurrentTimeZoneID];
        //    if (!string.IsNullOrEmpty(timeZoneID))
        //        return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(dateTime, timeZoneID);
        //    else
        //        return DateTime.Now;
        //}

        /// <summary>
		/// Get the first day of the week
		/// </summary>
		/// <param name="dayInWeek">Current date</param>
		/// <param name="firstDay">First Day in the week</param>
		/// <returns></returns>
		public static DateTime GetFirstDateOfWeek(DateTime dayInWeek, DayOfWeek firstDay)
        {
            DateTime firstDayInWeek = dayInWeek.Date;
            while (firstDayInWeek.DayOfWeek != firstDay)
                firstDayInWeek = firstDayInWeek.AddDays(-1);

            return firstDayInWeek;
        }

        /// <summary>
        /// Get Last day of the week
        /// </summary>
        /// <param name="dayInWeek">Current date</param>
        /// <param name="LastDay">Last Day in the week</param>
        /// <returns></returns>
        public static DateTime GetLastDateOfWeek(DateTime dayInWeek, DayOfWeek LastDay)
        {
            DateTime lastDayInWeek = dayInWeek.Date;
            while (lastDayInWeek.DayOfWeek != LastDay)
                lastDayInWeek = lastDayInWeek.AddDays(1);

            return lastDayInWeek;
        }

        /// <summary>
        /// Get Last Date of the Month
        /// </summary>
        /// <param name="Year">Year</param>
        /// <param name="Month">Month</param>
        /// <returns></returns>
        public static DateTime GetLastDateOfTheMonth(int Year, int Month)
        {
            DateTime firstOfNextMonth = new DateTime(Year, Month, 1).AddMonths(1);
            DateTime lastOfThisMonth = firstOfNextMonth.AddDays(-1);
            return lastOfThisMonth;
        }

        /// <summary>
        /// Get different between 2 dates
        /// </summary>
        /// <param name="DateStart"></param>
        /// <param name="DateEnd"></param>
        /// <returns></returns>
        public static TimeSpan CompareTwoDates(DateTime DateStart, DateTime DateEnd)
        {
            TimeSpan ts = DateEnd - DateStart;
            return ts;
        }

        public static string FormatAsShortDate(DateTime dateTime)
        {
            try
            {
                return dateTime.ToString("dd-MMM-yyyy");
            }
            catch (Exception)
            {
                return "Invalid Date";
            }
        }

        public static string ToStandardizedDateFormat(DateTime dateTime)
        {
            try
            {
                return dateTime.ToString(STANDARD_DATE_FORMAT);
            }
            catch (Exception)
            {
                return "Invalid Date";
            }
        }

        /// <summary>
        /// If the date time parameter is same date as today, show only time, else show full date and time
        /// </summary>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static string ToStandardizedTimeIfSameDateFormat(DateTime dateTime, bool showSeconds = true)
        {
            try
            {
                if (dateTime.Date == GetCurrentDateTime().Date)
                {
                    if (showSeconds == true)
                        return dateTime.ToString(STANDARD_TIME_FORMAT_WITH_SECONDS);
                    else
                        return dateTime.ToString(STANDARD_TIME_FORMAT_WITH_NO_SECONDS);
                }
                else
                {
                    if (showSeconds == true)
                        return dateTime.ToString(STANDARD_DATETIME_FORMAT_WITH_SECONDS);
                    else
                        return dateTime.ToString(STANDARD_DATETIME_FORMAT_WITH_NO_SECONDS);
                }
            }
            catch (Exception)
            {
                return "Invalid Date Time";
            }
        }


        public static string ToStandardizedDateTimeFormat(DateTime dateTime)
        {
            try
            {
                return dateTime.ToString(STANDARD_DATETIME_FORMAT);
            }
            catch (Exception)
            {
                return "Invalid Date";
            }
        }

        public static string ToStandardizedTimeWithSecondFormat(DateTime dateTime)
        {
            try
            {
                return dateTime.ToString(STANDARD_TIME_FORMAT_WITH_SECONDS);
            }
            catch (Exception)
            {
                return "Invalid Date";
            }
        }

        public static string ToStandardizedDateTimeWithSecondFormat(DateTime dateTime)
        {
            try
            {
                return dateTime.ToString(STANDARD_DATETIME_FORMAT_WITH_SECONDS);
            }
            catch (Exception)
            {
                return "Invalid Date";
            }
        }

        public static string ToStandardizedDateTimeFormat(DateTime? dateTime)
        {
            try
            {
                if (dateTime.HasValue)
                    return dateTime.Value.ToString(STANDARD_DATETIME_FORMAT);
                else
                    return "-";
            }
            catch (Exception)
            {
                return "Invalid Date";
            }
        }

        public static string ToStandardizedDateFormat(DateTime? dateTime)
        {
            if (dateTime.HasValue)
                return ToStandardizedDateFormat(dateTime.Value);
            else
                return string.Empty;
        }

        /// <summary>
        /// Allows looping each day from a date range
        /// </summary>
        public static IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }

        public static string ToPrettyFormat(this TimeSpan timeSpan)
        {
            var dayParts = new[] { GetDays(timeSpan), GetHours(timeSpan), GetMinutes(timeSpan) }
                .Where(s => !string.IsNullOrEmpty(s))
                .ToArray();

            var numberOfParts = dayParts.Length;

            string result;
            if (numberOfParts == 0)
            {
                return "0 minute";
            }
            else if (numberOfParts < 2)
                result = dayParts.FirstOrDefault() ?? string.Empty;
            else
                result = string.Join(", ", dayParts, 0, numberOfParts - 1) + " and " + dayParts[numberOfParts - 1];

            return result;
        }
        public static string ToPrettyFormatSecond(this TimeSpan timeSpan)
        {
            var dayParts = new[] { GetDays(timeSpan), GetHours(timeSpan), GetMinutes(timeSpan), GetSeconds(timeSpan) }
                .Where(s => !string.IsNullOrEmpty(s))
                .ToArray();

            var numberOfParts = dayParts.Length;

            string result;
            if (numberOfParts == 0)
            {
                return "0 second";
            }
            else if (numberOfParts < 2)
                result = dayParts.FirstOrDefault() ?? string.Empty;
            else
                result = string.Join(", ", dayParts, 0, numberOfParts - 1) + " and " + dayParts[numberOfParts - 1];

            return result;
        }
        private static string GetSeconds(TimeSpan timeSpan)
        {
            if (timeSpan.Seconds == 0) return string.Empty;
            if (timeSpan.Seconds == 1) return "1 second";
            return timeSpan.Seconds + " seconds";
        }

        private static string GetMinutes(TimeSpan timeSpan)
        {
            if (timeSpan.Minutes == 0) return string.Empty;
            if (timeSpan.Minutes == 1) return "1 minute";
            return timeSpan.Minutes + " minutes";
        }

        private static string GetHours(TimeSpan timeSpan)
        {
            if (timeSpan.Hours == 0) return string.Empty;
            if (timeSpan.Hours == 1) return "1 hour";
            return timeSpan.Hours + " hours";
        }

        private static string GetDays(TimeSpan timeSpan)
        {
            if (timeSpan.Days == 0) return string.Empty;
            if (timeSpan.Days == 1) return "1 day";
            return timeSpan.Days + " days";
        }

        /// <summary>
        /// converts utc date time to local time zone date time 
        /// </summary>
        /// timeUtc">
        /// <returns></returns>
        public static DateTime ConvertTimeFromUtc(DateTime timeUtc)
        {
            DateTime destTime = TimeZoneInfo.ConvertTimeFromUtc(timeUtc, TimeZoneInfo.Local);
            return destTime;
        }

        /// <summary>
        /// If unable to convert, will return Today + 100 Years
        /// </summary>
        /// <param name="datetime"></param>
        /// <param name="dateFormat"></param>
        /// <returns></returns>
        public static DateTime ConvertDateTime(string datetime, string[] dateFormat)
        {
            DateTime retVal = DateTime.Now.AddYears(100);
            if (DateTime.TryParseExact(datetime, dateFormat, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out retVal))
            {
                return DateTime.ParseExact(datetime, dateFormat, CultureInfo.InvariantCulture);
            }

            return retVal;
        }


        /// <summary>
        /// converts local date time to utc zone date time 
        /// </summary>
        /// timeUtc">
        /// <returns></returns>
        public static DateTime ConvertUtcFromLocal(DateTime local)
        {
            DateTime destTime = TimeZoneInfo.ConvertTimeToUtc(local, TimeZoneInfo.Utc);
            return destTime;
        }

        /// <summary>
        /// Get javascript time stamp value
        /// </summary>
        /// <param name="input">A Datetime input</param>
        /// <returns>A javascript time stamp value</returns>
        public static long GetJavascriptTimestamp(DateTime input)
            => (long)Math.Round(DateTime.UtcNow
               .Subtract(new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc))
               .TotalMilliseconds, 0);

        public static string GetMonthName(int month)
            => CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(month);

        /// <summary>
        /// Get total time format string in d:h:m:s by using timespan
        /// </summary>
        /// <param name="timeSpan">TimeSpan object</param>
        /// <returns></returns>
        public static string PopulateTotalTime(TimeSpan timeSpan) => GetTotalTime(timeSpan);

        /// <summary>
        /// Get total time format string in d:h:m:s by using time difference between two dates
        /// </summary>
        /// <param name="startDate">Start Date</param>
        /// <param name="endDate">End Date</param>
        /// <returns></returns>
        public static string PopulateTotalTime(DateTime startDate, DateTime endDate) => GetTotalTime(endDate.Subtract(startDate));

        /// <summary>
        /// Get total time format string in d:h:m:s by using minutes value
        /// </summary>
        /// <param name="minutes">Minutes value</param>
        /// <returns></returns>
        public static string PopulateMinutesToTotalTime(double minutes) => GetTotalTime(TimeSpan.FromMinutes(minutes));

        /// <summary>
        /// Get total time format string in d:h:m:s by using second value
        /// </summary>
        /// <param name="seconds"></param>
        /// <returns></returns>
        public static string PopulateSecondsToTotalTime(double seconds) => GetTotalTime(TimeSpan.FromSeconds(seconds));

        private static string GetTotalTime(TimeSpan timeDifference)
        {
            string day = timeDifference.Days > 0 ? $"{timeDifference.Days}d" : string.Empty;
            string hour = timeDifference.Hours > 0 ? $"{timeDifference.Hours}h" : string.Empty;
            string minute = timeDifference.Minutes > 0 ? $"{timeDifference.Minutes}m" : string.Empty;
            string second = timeDifference.Seconds > 0 ? $"{timeDifference.Seconds}s"
                : ((string.IsNullOrWhiteSpace(day) && string.IsNullOrWhiteSpace(hour) &&
                string.IsNullOrWhiteSpace(minute)) ? "0" : string.Empty);

            StringBuilder sb = new StringBuilder();
            sb.Append(day).Append((day.Length > 0 && (hour.Length > 0 || minute.Length > 0 || second.Length > 0)) ? ":" : string.Empty)
                .Append(hour).Append((hour.Length > 0 && (minute.Length > 0 || second.Length > 0)) ? ":" : string.Empty)
                .Append(minute).Append((minute.Length > 0 && second.Length > 0) ? ":" : string.Empty)
                .Append(second);

            return sb.ToString();
        }

        public static TimeSpan StripMiliseconds(this TimeSpan timeSpan)
        {
            var totalSeconds = Math.Round(timeSpan.TotalSeconds);
            return TimeSpan.FromSeconds(totalSeconds);
        }

        public static int NumberOfWorkDays(DateTime start, DateTime end, bool includeSaturday = false, bool includeSunday = false)
        {
            int workDays = 0;

            while (start.Date != end.Date)
            {
                workDays++;
                if ((start.DayOfWeek == DayOfWeek.Saturday && !includeSaturday) || (start.DayOfWeek == DayOfWeek.Sunday && !includeSaturday))
                {
                    workDays--;
                }

                start = start.AddDays(1);
            }

            return workDays;
        }
    }
}
