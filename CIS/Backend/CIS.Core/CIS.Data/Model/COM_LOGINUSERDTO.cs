using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Data.Model
{
    public class COM_LOGINUSERDTO
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string USERID { get; set; }
        public string PASSWORD { get; set; }
        public string USERNAME { get; set; }
        public string ROLEID { get; set; }
        public int DUMMYPASSWORD_FLAG { get; set; }
        public int USERLOCK_FLAG { get; set; }
        public DateTime PWDEXPIRES { get; set; }
        public int PWDCHANGEINTERVAL { get; set; }
        public DateTime LASTACCESSDATE { get; set; }
        public int SAMEUSERLOGINMAX { get; set; }
        public int FAILEDLOGINATTEMPTS { get; set; }
        public int FAILEDCOUNT { get; set; }
        public DateTime FAILEDSTARTDATE { get; set; }
        public DateTime UPDATE_DATE { get; set; }
        public string UPDATE_USER { get; set; }
        public string UPDATE_TERMINAL { get; set; }
        public int UPDATE_KIND { get; set; }
        public string UPDATE_PROCESS { get; set; }
        public string WAREHOUSE_CODE { get; set; }
    }
}
