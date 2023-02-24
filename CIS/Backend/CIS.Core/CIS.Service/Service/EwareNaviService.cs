using CIS.Common.Constants;
using CIS.Common.Helper;
using CIS.Common.Utils;
using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using Microsoft.VisualBasic.CompilerServices;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace CIS.Services.Service
{
    public class EwareNaviService : IEwareNaviService
    {
        private OracleConnection _oracleConnection;
        private readonly AppSettings _appSettings;

        public EwareNaviService(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
            _oracleConnection = new OracleConnection(appSettings.Value.OracleConnection);
        }
        #region Authenticate
        public async Task<AuthDataReponse> Authenticate(string username, string password, EwnTblLocationDTO location)
        {
            //var user = _users.SingleOrDefault(x => x.UserId == username);
            var user = await LoginValidation(username,password);

            if (user != null)
            {
                //var isLocal = await _ctx3.COM_LOGINUSERs.Where(st => st.USERID == username).FirstAsync();
                AuthDataReponse _user = new AuthDataReponse();
                _user = GenerateAccountResponse(user, location);

                if (_user != null)
                    return _user;
                return null;
            }
            else
                return null;
        }
        private async Task<COM_LOGINUSERDTO> LoginValidation(string user, string password)
        {
            COM_LOGINUSERDTO loginuser = new COM_LOGINUSERDTO();

            try
            {
                _oracleConnection.Open();
                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;                
                oracleCommand.CommandText = string.Format(@"select * from com_loginuser where userid = '{0}' and password = '{1}' and ROLEID in ('FORKLIFT', 'PLANT')", user, password);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                if (oracleDataReader1.Read())
                {
                    loginuser.USERID = DataTypeUtils.SaveConvert(oracleDataReader1["userid"],"");
                    loginuser.USERNAME = DataTypeUtils.SaveConvert(oracleDataReader1["username"], "");
                    loginuser.ROLEID = DataTypeUtils.SaveConvert(oracleDataReader1["roleid"], "");
                    loginuser.WAREHOUSE_CODE = DataTypeUtils.SaveConvert(oracleDataReader1["WAREHOUSE_CODE"], "");
                    return loginuser;
                }

            }
            catch(Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }
          
            return null;
        }

        private AuthDataReponse GenerateAccountResponse(COM_LOGINUSERDTO userData, EwnTblLocationDTO location)
        {
            string locationInfo = string.Empty;
            if (location != null)
                locationInfo = location.LocationId + AuthConst.LOCATION_SEPARATOR + location.LocationName + AuthConst.LOCATION_SEPARATOR + location.PlantName;

            AuthDataReponse authResp = new AuthDataReponse();
            if (userData != null && !String.IsNullOrEmpty(userData.USERID))
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_appSettings.Secret);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim(ClaimTypes.Name, userData.USERID),
                    new Claim(ClaimTypes.Locality, locationInfo)
                    }),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);

                authResp.Token = tokenHandler.WriteToken(token);
                authResp.TokenExpiry = DateTime.UtcNow.AddDays(7);
                authResp.UserId = userData.USERID;
                authResp.base64img = CommonHelper.GetNoPicture();
                authResp.Name = userData.USERNAME;
                authResp.RoleId = userData.ROLEID;
                authResp.Location = location == null ? "" : location.LocationName;
                authResp.LocationId = location == null ? 0 : location.LocationId;

                return authResp;
            }
            else
            {
                return null;
            }
        }

        #endregion


        public async Task<List<DNSTOCKDTO>> GetDNStockByPalletID(string palletID)
        {
            List<DNSTOCKDTO> dnstockLst = new List<DNSTOCKDTO>();

            try
            {
                _oracleConnection.Open();
                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"select * from dnstock where pallet_no = '{0}' ", palletID);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                while (oracleDataReader1.Read())
                {
                    DNSTOCKDTO dnstock = new DNSTOCKDTO();
                    dnstock.STOCK_ID = DataTypeUtils.SaveConvert(oracleDataReader1["STOCK_ID"], "");
                    dnstock.AREA_NO = DataTypeUtils.SaveConvert(oracleDataReader1["AREA_NO"], "");
                    dnstock.LOCATION_NO = DataTypeUtils.SaveConvert(oracleDataReader1["LOCATION_NO"], "");
                    dnstock.PALLET_NO = DataTypeUtils.SaveConvert(oracleDataReader1["PALLET_NO"], "");
                    dnstock.CONSIGNOR_CODE = DataTypeUtils.SaveConvert(oracleDataReader1["CONSIGNOR_CODE"], "");
                    dnstock.ITEM_CODE = DataTypeUtils.SaveConvert(oracleDataReader1["ITEM_CODE"], "");
                    dnstock.QA_FLAG = DataTypeUtils.SaveConvert(oracleDataReader1["QA_FLAG"], "");
                    dnstock.LOT_NO = DataTypeUtils.SaveConvert(oracleDataReader1["LOT_NO"], "");
                    dnstock.PO_NO = DataTypeUtils.SaveConvert(oracleDataReader1["PO_NO"], "");
                    dnstock.SO_NO = DataTypeUtils.SaveConvert(oracleDataReader1["SO_NO"], "");
                    dnstock.STORAGE_DAY = DataTypeUtils.SaveConvert(oracleDataReader1["STORAGE_DAY"], "");
                    dnstock.STORAGE_DATE = DataTypeUtils.SaveConvert(oracleDataReader1["STORAGE_DATE"], (DateTime?)null);
                    dnstock.RETRIEVAL_DAY = DataTypeUtils.SaveConvert(oracleDataReader1["RETRIEVAL_DAY"], "");
                    dnstock.STOCK_QTY = DataTypeUtils.SaveConvert(oracleDataReader1["STOCK_QTY"], 0);
                    dnstock.ALLOCATION_QTY = DataTypeUtils.SaveConvert(oracleDataReader1["ALLOCATION_QTY"], 0);
                    dnstock.PLAN_QTY = DataTypeUtils.SaveConvert(oracleDataReader1["PLAN_QTY"], 0);
                    dnstock.PALLET_ID = DataTypeUtils.SaveConvert(oracleDataReader1["PALLET_ID"], "");
                    dnstock.REGIST_DATE = DataTypeUtils.SaveConvert(oracleDataReader1["REGIST_DATE"], DateTime.Now);
                    dnstock.REGIST_PNAME = DataTypeUtils.SaveConvert(oracleDataReader1["REGIST_PNAME"], "");
                    dnstock.LAST_UPDATE_DATE = DataTypeUtils.SaveConvert(oracleDataReader1["LAST_UPDATE_DATE"], DateTime.Now);
                    dnstock.LAST_UPDATE_PNAME = DataTypeUtils.SaveConvert(oracleDataReader1["LAST_UPDATE_PNAME"], "");
                    dnstock.WAREHOUSE_CODE = DataTypeUtils.SaveConvert(oracleDataReader1["WAREHOUSE_CODE"], "");
                    dnstock.PLAN_DAY = GetPlanDay(DataTypeUtils.SaveConvert(oracleDataReader1["SO_NO"], ""));
                    dnstockLst.Add(dnstock);
                }

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return dnstockLst;
        }

        public DateTime GetPlanDay(string palletID)
        {
            try
            {
                var dNStoragePlanDay = GetDNStoragePlanDay(palletID);
                Task.WaitAll(dNStoragePlanDay);

                if(dNStoragePlanDay.Result != null)
                    return (DateTime)dNStoragePlanDay.Result;

                var dnworkInfoPlanDay = GetDnWorkInfoPlanDay(palletID);
                Task.WaitAll(dnworkInfoPlanDay);

                if (dnworkInfoPlanDay.Result != null)
                    return (DateTime)dnworkInfoPlanDay.Result;

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }

            return DateTime.Now;
        }


        public String GetCustPONumber(string palletID)
        {
            try
            {
                var dNStorageCustPONumber = GetDNStorageCustPONumber(palletID);
                Task.WaitAll(dNStorageCustPONumber);

                if (!string.IsNullOrEmpty(dNStorageCustPONumber.Result))
                    return dNStorageCustPONumber.Result;

                var dnworkInfoCustPONumber = GetDnWorkInfoCustPONumber(palletID);
                Task.WaitAll(dnworkInfoCustPONumber);

                if (!string.IsNullOrEmpty(dnworkInfoCustPONumber.Result))
                    return dnworkInfoCustPONumber.Result;

                var dNStockCustPONumber = GetDnStockCustPONumber(palletID);
                Task.WaitAll(dNStockCustPONumber);

                if (!string.IsNullOrEmpty(dNStockCustPONumber.Result))
                    return dNStockCustPONumber.Result;
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }

            return string.Empty;
        }

        private async Task<DateTime?> GetDNStoragePlanDay(string SONumber)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"SELECT PLAN_DAY FROM DNSTORAGEPLAN  WHERE RECEIVE_TICKET_NO = '{0}' ORDER BY PLAN_UKEY DESC ", SONumber);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                string[] format = {"yyyyMMdd"};
                while (oracleDataReader1.Read())
                {
                    return DateTimeUtils.ConvertDateTime(oracleDataReader1["PLAN_DAY"].ToString(), format);
                }

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return (DateTime?)null;
        }
        private async Task<DateTime?> GetDnWorkInfoPlanDay(string SONumber)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"SELECT * FROM DNWORKINFO  WHERE RECEIVE_TICKET_NO = '{0}' ORDER BY JOB_NO DESC ", SONumber);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                string[] format = { "yyyyMMdd" };
                while (oracleDataReader1.Read())
                {
                    return DateTimeUtils.ConvertDateTime(oracleDataReader1["PLAN_DAY"].ToString(), format);
                }

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return (DateTime?)null;
        }


        private async Task<String> GetDNStorageCustPONumber(string SONumber)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"SELECT PLAN_PO_NO FROM DNSTORAGEPLAN  WHERE RECEIVE_TICKET_NO = '{0}' ", SONumber);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                string[] format = { "yyyyMMdd" };
                while (oracleDataReader1.Read())
                {
                    return DataTypeUtils.SaveConvert(oracleDataReader1["PLAN_PO_NO"].ToString(), string.Empty);
                }

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return string.Empty;
        }
        private async Task<string> GetDnWorkInfoCustPONumber(string SONumber)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"SELECT PLAN_PO_NO FROM DNWORKINFO  WHERE RECEIVE_TICKET_NO = '{0}' ", SONumber);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                string[] format = { "yyyyMMdd" };
                while (oracleDataReader1.Read())
                {
                    return DataTypeUtils.SaveConvert(oracleDataReader1["PLAN_PO_NO"].ToString(), string.Empty);
                }

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return string.Empty;
        }
        private async Task<string> GetDnStockCustPONumber(string SONumber)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"SELECT PO_NO FROM DNSTOCK  WHERE SO_NO = '{0}' ", SONumber);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                while (oracleDataReader1.Read())
                {
                    return DataTypeUtils.SaveConvert(oracleDataReader1["PO_NO"].ToString(), string.Empty);
                }

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return string.Empty;
        }

        #region Validation

        public async Task<bool> CheckStockWarehouseCodeAreaNo(string warehouse_code, string area_no, string palletNo)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"select 1 from dnstock where warehouse_code = '{0}' and area_no = '{1}' and pallet_no = '{2}'", warehouse_code, area_no, palletNo);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();

                return oracleDataReader1.Read();

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return false;
        }
        public async Task<bool> HasSOItemReserved(List<EWN_CompletedPalletDTO> eWN_CompletedPalletDTOLst)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                foreach (var ewnDto in eWN_CompletedPalletDTOLst)
                {
                    //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                    OracleCommand command = _oracleConnection.CreateCommand();
                    OracleCommand oracleCommand = new OracleCommand();
                    oracleCommand.Connection = _oracleConnection;
                    oracleCommand.CommandText = string.Format(@"select * from dnworkinfo where job_type = '02' and receive_ticket_no = '{0}' and item_code = '{1}' and warehouse_code <> '{2}' order by last_update_date desc ", ewnDto.PONumber, ewnDto.Item, EwareNaviConst.WAREHOUSE_CODE_COMMON);
                    oracleCommand.CommandType = CommandType.Text;
                    var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();

                    return oracleDataReader1.Read();
                }
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return false;
        }
        public async Task<string> HasReservedEmptyLocation(List<EWN_CompletedPalletDTO> eWN_CompletedPalletDTOLst)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                foreach (var ewnDto in eWN_CompletedPalletDTOLst)
                {
                    //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                    OracleCommand command = _oracleConnection.CreateCommand();
                    OracleCommand oracleCommand = new OracleCommand();
                    oracleCommand.Connection = _oracleConnection;
                    oracleCommand.CommandText = string.Format(@"select * from dnworkinfo where warehouse_code <> '{0}' and job_type = '02' and receive_ticket_no = '{1}' and item_code = '{2}' and status_flag = '0' order by receive_line_no ", EwareNaviConst.WAREHOUSE_CODE_COMMON, ewnDto.PONumber, ewnDto.Item);
                    oracleCommand.CommandType = CommandType.Text;
                    var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();

                    if (oracleDataReader1.Read())
                        return string.Empty;
                    else
                        return string.Format(EwareNaviConst.WARNING_MSG_PALLET_NO_RESERVERD, ewnDto.PONumber);
                }
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return EwareNaviConst.WARNING_MSG_PALLET_NO_RESERVERD;
        }
        public async Task<string> GetReservedWarehouse(List<EWN_CompletedPalletDTO> eWN_CompletedPalletDTOLst)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                foreach (var ewnDto in eWN_CompletedPalletDTOLst)
                {
                    //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                    OracleCommand command = _oracleConnection.CreateCommand();
                    OracleCommand oracleCommand = new OracleCommand();
                    oracleCommand.Connection = _oracleConnection;
                    oracleCommand.CommandText = string.Format(@"select warehouse_code from dnworkinfo where job_type = '02' and receive_ticket_no = '{0}' and item_code = '{1}' order by last_update_date desc", ewnDto.PONumber, ewnDto.Item);
                    oracleCommand.CommandType = CommandType.Text;
                    var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();
                    while (oracleDataReader1.Read())
                    {
                        return DataTypeUtils.SaveConvert(oracleDataReader1["warehouse_code"].ToString(), string.Empty);
                    }
                }
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return EwareNaviConst.WARNING_MSG_PALLET_NO_RESERVERD;
        }
        public async Task<bool> isProductionOutputCheckedOut(string palletNo)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();
               
               //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"select * from dnstock where pallet_no = '{0}' and area_no in ('STAG')", palletNo);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();

                return oracleDataReader1.Read();
                
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return false;
        }
        #endregion

        #region CheckIn

        public async Task<bool> IsStockInserted(string inPalletNo, string inAreaNo)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"select * from dnstock where pallet_no = '{0}' and area_no = '{1}'", inPalletNo, inAreaNo);
                oracleCommand.CommandType = CommandType.Text;
                var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();

                return oracleDataReader1.Read();

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return false;
        }

        public async Task<bool> UpdateCheckInStock(string inPalletNo, string inWarehouseCode, string inAreaNo)
        {
            try
            {
                if (_oracleConnection.State == ConnectionState.Closed)
                    _oracleConnection.Open();

                //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
                OracleCommand command = _oracleConnection.CreateCommand();
                OracleCommand oracleCommand = new OracleCommand();
                oracleCommand.Connection = _oracleConnection;
                oracleCommand.CommandText = string.Format(@"update dnstock set warehouse_code = '{0}', area_no = '{1}' where pallet_no = '{2}'", inWarehouseCode, inAreaNo, inPalletNo);
                oracleCommand.CommandType = CommandType.Text;
                //var oracleDataReader1 = await oracleCommand.ExecuteReaderAsync();

                return await oracleCommand.ExecuteNonQueryAsync() > 0;

            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            finally
            {
                if (_oracleConnection.State == ConnectionState.Open)
                    _oracleConnection.Close();
            }

            return false;
        }


        public bool InsertStock(string inPalletNo, string inWarehouseCode, string inCustPONo, string inItemCode, string inQAFlag, string inLotNo, string inSONo, string inQty, string userId, string userName)
        {
            if (_oracleConnection.State == ConnectionState.Closed)
                _oracleConnection.Open();

            //OracleTransaction oracleTransaction = _oracleConnection.BeginTransaction();
            OracleCommand command = _oracleConnection.CreateCommand();

            string nextStockId = this.GetNextStockID(_oracleConnection);
            command.CommandText = "insert into dnstock(po_no, stock_id, area_no, location_no, pallet_no, consignor_code, item_code, qa_flag, lot_no, so_no, storage_day, storage_date, stock_qty,  allocation_qty, plan_qty, regist_pname, warehouse_code) values (:poNo, :stockId, :areaNo, :locationNo, :palletNo, :consignorCode, :itemCode, :qaFlag, :lotNo, :soNo, :storageDay, SYSDATE, :stockQty,  :allocationQty, :planQty, :registPname, :warehouseCode)";
            command.CommandType = CommandType.Text;
            command.Parameters.Clear();
            command.Parameters.Add(":poNo", OracleDbType.Varchar2).Value = (object)inCustPONo;
            command.Parameters.Add(":stockId", OracleDbType.Varchar2).Value = (object)nextStockId;
            command.Parameters.Add(":areaNo", OracleDbType.Varchar2).Value = (object)"STAG";
            command.Parameters.Add(":locationNo", OracleDbType.Varchar2).Value = (object)"33333333";
            command.Parameters.Add(":palletNo", OracleDbType.Varchar2).Value = (object)inPalletNo;
            command.Parameters.Add(":consignorCode", OracleDbType.Varchar2).Value = (object)"0";
            command.Parameters.Add(":itemCode", OracleDbType.Varchar2).Value = (object)inItemCode;
            command.Parameters.Add(":qaFlag", OracleDbType.Varchar2).Value = (object)inQAFlag;
            command.Parameters.Add(":lotNo", OracleDbType.Varchar2).Value = (object)VariantType.Null;
            command.Parameters.Add(":soNo", OracleDbType.Varchar2).Value = (object)inSONo;
            command.Parameters.Add(":storageDay", OracleDbType.Varchar2).Value = (object)Strings.Format((object)DateAndTime.Today, "yyyyMMdd");
            command.Parameters.Add(":stockQty", OracleDbType.Varchar2).Value = (object)inQty;
            command.Parameters.Add(":allocationQty", OracleDbType.Varchar2).Value = (object)inQty;
            command.Parameters.Add(":planQty", OracleDbType.Varchar2).Value = (object)inQty;
            command.Parameters.Add(":registPname", OracleDbType.Varchar2).Value = (object)this.GetType().Name;
            command.Parameters.Add(":WarehouseCode", OracleDbType.Varchar2).Value = (object)inWarehouseCode;
            if (command.ExecuteNonQuery() <= 0)
                return false;
            if (this.InsertStockhistory(_oracleConnection, new EntStockhistory()
            {
                WorkDay = Strings.Format((object)DateAndTime.Today, "yyyyMMdd"),
                JobType = "02",
                StockId = nextStockId,
                AreaNo = "STAG",
                LocationNo = "33333333",
                ConsignorCode = "0",
                ItemCode = inItemCode,
                UpdateStockQty = Conversions.ToInteger(inQty),
                IncDecQty = Conversions.ToInteger(inQty),
                PalletId = inPalletNo,
                UserId = userId,
                UserName = userName,
                //TerminalNo = Module1.ForkliftNo,
                RegistPname = this.GetType().Name,
                WarehouseCode = inWarehouseCode,
                LotNo = inSONo
            }))
                return true;
            //this.DisplayResult(Color.Red, "Error", "Process (InsertStockhistory) failed, please contact support.");
            return false;
        }
        public string GetNextStockID(OracleConnection conn)
        {
            OracleCommand command = conn.CreateCommand();
            command.CommandText = "SELECT STOCK_ID_SEQ.NEXTVAL as maxid FROM DUAL";
            command.CommandType = CommandType.Text;
            OracleDataReader oracleDataReader = command.ExecuteReader();
            return oracleDataReader.Read() ? Conversions.ToLong(oracleDataReader["maxid"]).ToString("D8") : "";
        }
        public bool InsertStockhistory(OracleConnection conn, EntStockhistory inStockhistory)
        {
            OracleCommand command = conn.CreateCommand();
            command.CommandText = "insert into dnstockhistory  (work_day, job_type, stock_id, area_no,  location_no, consignor_code, item_code, lot_no, update_stock_qty,  inc_dec_qty, pallet_id, user_id,  user_name, regist_pname, warehouse_code)  values (:workDay, :jobType, :stockId, :areaNo,  :locationNo, :consignorCode, :itemCode, :lotNo, :updateStockQty,  :incDecQty, :palletId, :userId,  :userName, :registPname, :warehouseCode)";
            command.CommandType = CommandType.Text;
            command.Parameters.Clear();
            command.Parameters.Add(":workDay", OracleDbType.Varchar2).Value = (object)inStockhistory.WorkDay;
            command.Parameters.Add(":jobType", OracleDbType.Varchar2).Value = (object)inStockhistory.JobType;
            command.Parameters.Add(":stockId", OracleDbType.Varchar2).Value = (object)inStockhistory.StockId;
            command.Parameters.Add(":areaNo", OracleDbType.Varchar2).Value = (object)inStockhistory.AreaNo;
            command.Parameters.Add(":locationNo", OracleDbType.Varchar2).Value = (object)inStockhistory.LocationNo;
            command.Parameters.Add(":consignorCode", OracleDbType.Varchar2).Value = (object)inStockhistory.ConsignorCode;
            command.Parameters.Add(":itemCode", OracleDbType.Varchar2).Value = (object)inStockhistory.ItemCode;
            command.Parameters.Add(":lotNo", OracleDbType.Varchar2).Value = (object)inStockhistory.LotNo;
            command.Parameters.Add(":updateStockQty", OracleDbType.Varchar2).Value = (object)inStockhistory.UpdateStockQty;
            command.Parameters.Add(":incDecQty", OracleDbType.Varchar2).Value = (object)inStockhistory.IncDecQty;
            command.Parameters.Add(":palletId", OracleDbType.Varchar2).Value = (object)inStockhistory.PalletId;
            command.Parameters.Add(":userId", OracleDbType.Varchar2).Value = (object)inStockhistory.UserId;
            command.Parameters.Add(":userName", OracleDbType.Varchar2).Value = (object)inStockhistory.UserName;
            command.Parameters.Add(":terminalNo", OracleDbType.Varchar2).Value = (object)inStockhistory.TerminalNo;
            command.Parameters.Add(":registPname", OracleDbType.Varchar2).Value = (object)inStockhistory.RegistPname;
            command.Parameters.Add(":warehouseCode", OracleDbType.Varchar2).Value = (object)inStockhistory.WarehouseCode;
            return command.ExecuteNonQuery() > 0;
        }
        #endregion
    }


    public class EntStockhistory
    {
        private string _workDay;
        private string _jobType;
        private string _stockId;
        private string _areaNo;
        private string _locationNo;
        private string _consignorCode;
        private string _itemCode;
        private string _lotNo;
        private int _updateStockQty;
        private int _incDecQty;
        private string _palletId;
        private string _userId;
        private string _userName;
        private string _terminalNo;
        private string _registPname;
        private string _warehouseCode;

        public string WorkDay
        {
            get
            {
                return this._workDay;
            }
            set
            {
                this._workDay = value;
            }
        }

        public string JobType
        {
            get
            {
                return this._jobType;
            }
            set
            {
                this._jobType = value;
            }
        }

        public string StockId
        {
            get
            {
                return this._stockId;
            }
            set
            {
                this._stockId = value;
            }
        }

        public string AreaNo
        {
            get
            {
                return this._areaNo;
            }
            set
            {
                this._areaNo = value;
            }
        }

        public string LocationNo
        {
            get
            {
                return this._locationNo;
            }
            set
            {
                this._locationNo = value;
            }
        }

        public string ConsignorCode
        {
            get
            {
                return this._consignorCode;
            }
            set
            {
                this._consignorCode = value;
            }
        }

        public string ItemCode
        {
            get
            {
                return this._itemCode;
            }
            set
            {
                this._itemCode = value;
            }
        }

        public string LotNo
        {
            get
            {
                return this._lotNo;
            }
            set
            {
                this._lotNo = value;
            }
        }

        public int UpdateStockQty
        {
            get
            {
                return this._updateStockQty;
            }
            set
            {
                this._updateStockQty = value;
            }
        }

        public int IncDecQty
        {
            get
            {
                return this._incDecQty;
            }
            set
            {
                this._incDecQty = value;
            }
        }

        public string PalletId
        {
            get
            {
                return this._palletId;
            }
            set
            {
                this._palletId = value;
            }
        }

        public string UserId
        {
            get
            {
                return this._userId;
            }
            set
            {
                this._userId = value;
            }
        }

        public string UserName
        {
            get
            {
                return this._userName;
            }
            set
            {
                this._userName = value;
            }
        }

        public string TerminalNo
        {
            get
            {
                return this._terminalNo;
            }
            set
            {
                this._terminalNo = value;
            }
        }

        public string RegistPname
        {
            get
            {
                return this._registPname;
            }
            set
            {
                this._registPname = value;
            }
        }

        public string WarehouseCode
        {
            get
            {
                return this._warehouseCode;
            }
            set
            {
                this._warehouseCode = value;
            }
        }
    }
}
