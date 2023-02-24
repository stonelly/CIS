using System;
using System.Collections.Generic;

#nullable disable

namespace CIS.Data.Database
{
    public partial class TblGlobalVariableSetting
    {
        public string VariableKey { get; set; }
        public string Value { get; set; }
        public bool? Del { get; set; }
    }
}
