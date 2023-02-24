using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace CIS.Common.Utils
{
    /// <summary>
    /// Data Type Utilities class
    /// </summary>
    public static class DataTypeUtils
    {
        /// <summary>
		/// Convert object safely to double. Use default value if object cannot be converted
		/// </summary>
		/// <param name="value"></param>
		/// <param name="defaultValue"></param>
		/// <returns></returns>
		public static double SaveConvert(object value, double defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                double retVal = defaultValue;
                if (double.TryParse(val, NumberStyles.Float, CultureInfo.CurrentCulture, out retVal))
                    return Convert.ToDouble(value, CultureInfo.CurrentCulture);
            }
            return defaultValue;
        }

        /// <summary>
        /// Convert object safely to double. Use default value if object cannot be converted
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static decimal SaveConvert(object value, decimal defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                decimal retVal = defaultValue;
                if (decimal.TryParse(val, NumberStyles.Float, CultureInfo.CurrentCulture, out retVal))
                    return Convert.ToDecimal(value, CultureInfo.CurrentCulture);
            }
            return defaultValue;
        }

        /// <summary>
        /// Convert object safely to int. Use default value if object cannot be converted
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static int SaveConvert(object value, int defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                int retVal = defaultValue;
                if (int.TryParse(val, NumberStyles.Integer, CultureInfo.CurrentCulture, out retVal))
                    return Convert.ToInt32(value, CultureInfo.CurrentCulture);
            }
            return defaultValue;
        }
        public static int? SaveConvert(object value, int? defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                int retVal = 0;
                if (int.TryParse(val, NumberStyles.Integer, CultureInfo.CurrentCulture, out retVal))
                    return Convert.ToInt32(value, CultureInfo.CurrentCulture);
            }
            return (int?)null;
        }

        /// <summary>
        /// Convert object safely to long. Use default value if object cannot be converted
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static long SaveConvert(object value, long defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                long retVal = defaultValue;
                if (long.TryParse(val, NumberStyles.Integer, CultureInfo.CurrentCulture, out retVal))
                    return Convert.ToInt64(value, CultureInfo.CurrentCulture);
            }
            return defaultValue;
        }

        /// <summary>
        /// Convert object safely to boolean. Use default value if object cannot be converted
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static bool SaveConvert(object value, bool defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                bool retVal = defaultValue;
                if (val.Trim().ToUpper() == "Y" || val.Trim() == "1" || val.Trim().ToUpper() == "N")
                {
                    return (val.Trim().ToUpper() == "Y" || val.Trim() == "1") ? true : false;
                }
                else
                {
                    if (bool.TryParse(val, out retVal))
                        return Convert.ToBoolean(value, CultureInfo.CurrentCulture);
                }
            }
            return defaultValue;
        }

        /// <summary>
        /// Convert object safely to Datetime. Use default value if object cannot be converted
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static DateTime SaveConvert(object value, DateTime defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                DateTime retVal = defaultValue;
                if (DateTime.TryParse(val, CultureInfo.CurrentCulture, DateTimeStyles.None, out retVal))
                    return Convert.ToDateTime(value, CultureInfo.CurrentCulture);
            }
            return defaultValue;

        }
        public static DateTime? SaveConvert(object value, DateTime? defaultValue)
        {
            if (value != null)
            {
                string val = value.ToString();
                DateTime retVal = DateTime.Now;
                if (DateTime.TryParse(val, CultureInfo.CurrentCulture, DateTimeStyles.None, out retVal))
                    return DateTime.Parse(val, CultureInfo.CurrentCulture);
            }

            return (DateTime?)null;
            
        }

        /// <summary>
        /// Convert object safely to Datetime. Use default value if object cannot be converted
        /// </summary>
        /// <param name="value"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static string SaveConvert(object value, string defaultValue)
        {
            if (value != null)
            {
                return value.ToString();
            }
            return defaultValue;

        }

        /// <summary>
        /// Convert a list of comma delimited strings into a list of integer
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        public static List<int> ConvertCommaDelimitedToListOfInt(string values)
        {
            var result = new List<int>();
            try
            {
                var individualValues = values.Split(',');

                foreach (var v in individualValues)
                {
                    result.Add(Convert.ToInt32(v));
                }

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static List<string> ConvertCommaDelimitedToListOfString(string values)
        {
            var result = new List<string>();
            try
            {
                var individualValues = values.Split(',');
                foreach (var v in individualValues)
                {
                    result.Add(v);
                }
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static double ReturnWholeNumber(double value) => Math.Truncate(value);

        public static decimal ReturnWholeNumber(decimal value) => Math.Truncate(value);

        public static string ReturnKMfromMeters(double value)
        {
            var km = value / 1000;
            return String.Format("{0:0.00}km", km);
        }

        public static string ConvertUpperLower(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;

            return String.Join(" ", SplitCamelCase(value));
        }

        public static string[] SplitCamelCase(string source)
        {
            return Regex.Split(source, @"(?<!^)(?=[A-Z])");
        }
    }
}
