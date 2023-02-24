using CIS.Common.Constants;
using CIS.Common.Helper;
using CIS.Common.Utils;
using CIS.Data.Database;
using CIS.Data.Model;
using CIS.Data.Model.Request;
using CIS.Data.Model.Response;
using CIS.Services.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using static CIS.Common.Constants.GlobalConst;

namespace CIS.Services.Service
{
    public class Inventory360Service : IInventory360Service
    {
        private readonly B2SDBContext _db;
        private readonly AppSettings _appSettings;
        private OracleConnection _oracleConnection;
        private SqlConnection objconn = new SqlConnection(); 

        public Inventory360Service(IOptions<AppSettings> appSettings, B2SDBContext db)
        {
            _appSettings = appSettings.Value;
            _db = db;
            _oracleConnection = new OracleConnection(appSettings.Value.OracleConnection);
            objconn = new SqlConnection(_db.Database.GetDbConnection().ConnectionString);
        }
        #region Stock
        public async Task<List<TblStockMaster>> StockInfo(string palletID)
        {
            //var user = _users.SingleOrDefault(x => x.UserId == username);
            var stock = await GetStockMaster(palletID);

            if (stock != null)
            {
                return stock; 
            }
            else
                return null;
        }

        private async Task<List<TblStockMaster>> GetStockMaster(string palletID)
        {
            try
            {
                List<TblStockMaster> stockMasterLst = new List<TblStockMaster>();

                stockMasterLst = await _db.TblStockMasters.Where(c => c.PalletId == palletID).ToListAsync();

                if (stockMasterLst != null && stockMasterLst.Count() > 0)
                    return stockMasterLst;
            }
            catch(Exception ex)
            {
                var mess = ex.Message;
            }
          
            return null;
        }
        public async Task<List<PalletDetailDTO>> GetPalletInfo(string palletID)
        {
            DbCommand cmd;
            DbDataReader rdr;
            List<PalletDetailDTO> palletDtoLst = new List<PalletDetailDTO>();

            try
            {
                string sql = "sp_GetPalletDetails_ByPalletID_PalletComplete @pallet, @del, @sts, @sts2";

                // Build command object  
                cmd = _db.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = sql;

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@pallet";
                param.Value = palletID;
                cmd.Parameters.Add(param);

                param = new SqlParameter();
                param.ParameterName = "@del";
                param.Value = false;
                cmd.Parameters.Add(param);

                param = new SqlParameter();
                param.ParameterName = "@sts";
                param.Value = GlobalConst.StockStatus.Confirm;
                cmd.Parameters.Add(param);

                param = new SqlParameter();
                param.ParameterName = "@sts2";
                param.Value = GlobalConst.StockStatus.Confirm;
                cmd.Parameters.Add(param);

                // Open database connection  
                _db.Database.OpenConnection();

                // Create a DataReader  
                rdr = await cmd.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                // Build collection of Black products  
                while (await rdr.ReadAsync())
                {
                    PalletDetailDTO palletDto = new PalletDetailDTO();
                    palletDto.CartonID = DataTypeUtils.SaveConvert(rdr["CartonID"], "");
                    palletDto.CartonNo = DataTypeUtils.SaveConvert(rdr["CartonNo"], 0);
                    palletDto.BatchLotNo = DataTypeUtils.SaveConvert(rdr["BatchLotNo"], "");
                    palletDto.FGCode = DataTypeUtils.SaveConvert(rdr["FGCode"], "");
                    palletDto.Size = DataTypeUtils.SaveConvert(rdr["Size"], "");
                    palletDto.ForecastSO = DataTypeUtils.SaveConvert(rdr["ForecastSO"], "");
                    palletDto.ForecastWO = DataTypeUtils.SaveConvert(rdr["ForecastWO"], "");
                    palletDto.QAIDate = DataTypeUtils.SaveConvert(rdr["QAIDate"], (DateTime?)null);
                    palletDto.ExpiryDate = DataTypeUtils.SaveConvert(rdr["ExpiryDate"], (DateTime?)null);
                    palletDto.BatchMfgDate = DataTypeUtils.SaveConvert(rdr["BatchMfgDate"], (DateTime?)null);
                    palletDto.InnerBoxPerCarton = DataTypeUtils.SaveConvert(rdr["InnerBoxPerCarton"], (int?)null);
                    palletDto.InnerBoxPackingSize = DataTypeUtils.SaveConvert(rdr["InnerBoxPackingSize"], (int?)null);                    
                    palletDto.StockID = DataTypeUtils.SaveConvert(rdr["StockID"], (int?)null);
                    palletDto.NextLocation = DataTypeUtils.SaveConvert(rdr["NextLocation"], "");
                    palletDto.StockDID = DataTypeUtils.SaveConvert(rdr["StockDID"], (int?)null);
                    palletDto.CartonCapacity = DataTypeUtils.SaveConvert(rdr["CartonCapacity"], (int?)null);
                    palletDto.NowLocationName = DataTypeUtils.SaveConvert(rdr["NowLocationName"], "");
                    palletDto.BinLocationName = DataTypeUtils.SaveConvert(rdr["BinLocationName"], "");
                    palletDto.BinId = DataTypeUtils.SaveConvert(rdr["BinId"], (int?)null);
                    palletDto.Aging = DataTypeUtils.SaveConvert(rdr["Aging"], (int?)null);
                    palletDto.BlockAging = DataTypeUtils.SaveConvert(rdr["BlockAging"], 0);
                    palletDto.BlockExpired = DataTypeUtils.SaveConvert(rdr["BlockExpired"], 0);
                    

                    palletDtoLst.Add(palletDto);
                }

                rdr.Close();

            }
            catch(Exception ex)
            {
                var mess = ex.Message;
            }
          
            return palletDtoLst;
        }
        #endregion
        

        #region Location
        //public async Task<EwnTblLocation> LocationInfo(int LocationID)
        //{
        //    //var user = _users.SingleOrDefault(x => x.UserId == username);
        //    var Location = await GetEwnTblLocation(LocationID);

        //    if (Location != null)
        //    {
        //        return Location;
        //    }
        //    else
        //        return null;
        //}

        //private async Task<EwnTblLocation> GetEwnTblLocation(int LocationID)
        //{
        //    try
        //    {
        //        return await _db.EwnTblLocations.Where(c => c.LocationId == LocationID).FirstAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        var mess = ex.Message;
        //    }

        //    return null;
        //}



        //public async Task<List<EwnTblLocationDTO>> AllLocationInfo()
        //{
        //    var Location = from lct in _db.EwnTblLocations
        //                  where lct.Del == false 
        //                  select new EwnTblLocationDTO
        //                  {
        //                      LocationId = lct.LocationId,
        //                      LocationType = lct.LocationType,
        //                      LocationName = lct.LocationName,
        //                      StationName = lct.StationName,
        //                      Status = lct.Status,
        //                      Del = lct.Del,
        //                      LocationTypeName = GlobalConst.GetLocationTypeString(Convert.ToInt32(lct.LocationType))
        //                  };


        //    //var Location = await GetAllEwnTblLocation();

        //    if (Location != null)
        //    {
        //        return await Location.ToListAsync();
        //    }
        //    else
        //        return null;
        //}

        //private async Task<List<EwnTblLocation>> GetAllEwnTblLocation()
        //{
        //    try
        //    {
        //        return await _db.EwnTblLocations.Where(c => c.Del == false).ToListAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        var mess = ex.Message;
        //    }

        //    return null;
        //}
        //public async Task<bool> UpdateLocationInfo(EwnTblLocationDTO request)
        //{
        //    bool ret = false;
        //    var data = await _db.EwnTblLocations.Where(x => x.LocationId == request.LocationId && x.Del == false).FirstOrDefaultAsync();
        //    if (data != null)
        //    {
        //        using (var trans = _db.Database.BeginTransaction())
        //        {
        //            try
        //            {
        //                data.LocationName = request.LocationName;
        //                data.LocationId = request.LocationId;
        //                data.LocationType = request.LocationType;
        //                data.Status = request.Status;
        //                data.Del = request.Del;
        //                await _db.SaveChangesAsync();

        //                trans.Commit();
        //                ret = true;

        //            }
        //            catch
        //            {
        //                trans.Rollback();
        //                ret = false;
        //            }
        //        }
        //    }
        //    else
        //    {
        //        using (var trans = _db.Database.BeginTransaction())
        //        {
        //            try
        //            {
        //                EwnTblLocation EwnTblLocation = new EwnTblLocation();
        //                EwnTblLocation.LocationName = request.LocationName;
        //                EwnTblLocation.LocationType = request.LocationType;
        //                EwnTblLocation.LocationId = request.LocationId;
        //                EwnTblLocation.Status = (int)GlobalConst.Status.Active;
        //                EwnTblLocation.Del = false; // new always false
        //                await _db.EwnTblLocations.AddAsync(EwnTblLocation);

        //                await _db.SaveChangesAsync();

        //                trans.Commit();


        //                ret = true;
        //            }
        //            catch (Exception ex)
        //            {
        //                trans.Rollback();
        //            }
        //        }
        //    }

        //    return ret;
        //}

        //public async Task<bool> DeleteLocationInfo(int LocationID)
        //{
        //    bool ret = false;
        //    var data = await _db.EwnTblLocations.Where(x => x.LocationId == LocationID && x.Del == false).FirstOrDefaultAsync();
        //    if (data != null)
        //    {
        //        using (var trans = _db.Database.BeginTransaction())
        //        {
        //            try
        //            {
        //                data.Del = true;
        //                await _db.SaveChangesAsync();

        //                trans.Commit();
        //                ret = true;
        //            }
        //            catch
        //            {
        //                trans.Rollback();
        //                ret = false;
        //            }
        //        }
        //    }

        //    return ret;
        //}
        ////public async Task<bool> DeleteLocationInfo(int LocationID)
        ////{
        ////    int x = 0;
        ////    var result = _db.EwnTblLocations.SingleOrDefault(b => b.LocationId == LocationID);
        ////    if (result != null)
        ////    {
        ////        result.Del = true;
        ////        x = await _db.SaveChangesAsync();
        ////        return x == 0 ? false : true;
        ////    }
        ////    else
        ////        return false;
        ////}

        //public async Task<EwnTblLocation> GetLocationByIPAddress(string ipAddress)
        //{
        //    try
        //    {
        //        var location = from lct in _db.EwnTblLocations
        //                       join st in _db.EwnTblStationPcs on lct.LocationId equals st.LocationId
        //                       where lct.Del == false && lct.LocationType == (int)LocationTypeID.Warehouse && st.Del == false && st.StationName == ipAddress
        //                       select lct;

        //        return await location.FirstAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        var mess = ex.Message;
        //    }

        //    return null;

        //}


        public async Task<EwnTblLocationDTO> GetInv360LocationByIPAddress(string ipAddress)
        {
            DbCommand cmd;
            DbDataReader rdr;
            EwnTblLocationDTO tblLocation = new EwnTblLocationDTO();

            try
            {
                string sql = @"select tl.*, ts.Plant from tblLocation tl
                                join tblStationPC ts on tl.LocationID = ts.LocationID
                                where tl.Del = @del and ts.Del = @del and tl.LocationType = @type
                                and ts.StationName = @eid";

                // Build command object  
                cmd = _db.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = sql;

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@eid";
                param.Value = ipAddress;
                cmd.Parameters.Add(param);

                param = new SqlParameter();
                param.ParameterName = "@del";
                param.Value = false;
                cmd.Parameters.Add(param);

                param = new SqlParameter();
                param.ParameterName = "@type";
                param.Value = (int)LocationTypeID.Warehouse;
                cmd.Parameters.Add(param);

                // Open database connection  
                _db.Database.OpenConnection();

                // Create a DataReader  
                rdr = await cmd.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                // Build collection of Black products  
                while (await rdr.ReadAsync())
                {
                    tblLocation.LocationId = DataTypeUtils.SaveConvert(rdr["LocationId"], 0);
                    tblLocation.LocationName = DataTypeUtils.SaveConvert(rdr["LocationName"], "");
                    tblLocation.Del = DataTypeUtils.SaveConvert(rdr["Del"], false);
                    tblLocation.StationName = DataTypeUtils.SaveConvert(rdr["StationName"], "");
                    tblLocation.PlantName = DataTypeUtils.SaveConvert(rdr["Plant"], "");
                }

                rdr.Close();
                return tblLocation;
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }

            return null;

        }
        #endregion


        #region BinLocation
        public async Task<List<TblBinLocation>> GetTblBinLocationByLocationID(int locationID)
        {
            try
            {
                return await _db.TblBinLocations.Where(c => c.Status == (int)GlobalConst.Status.Active && c.Del == false && c.LocationId == locationID).ToListAsync();
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }

            return null;
        }
        #endregion

        #region employee
        public async Task<TblEmployee> GetEmployeeByID(string employeeID)
        {
            DbCommand cmd;
            DbDataReader rdr;
            TblEmployee tblEmployee = new TblEmployee();

            try
            {
                string sql = "sp_tblEmployee_SelectAll_ByID @eid, @del";

                // Build command object  
                cmd = _db.Database.GetDbConnection().CreateCommand();
                cmd.CommandText = sql;

                SqlParameter param = new SqlParameter();
                param.ParameterName = "@eid";
                param.Value = employeeID;
                cmd.Parameters.Add(param);

                param = new SqlParameter();
                param.ParameterName = "@del";
                param.Value = false;
                cmd.Parameters.Add(param);

                // Open database connection  
                _db.Database.OpenConnection();

                // Create a DataReader  
                rdr = await cmd.ExecuteReaderAsync(CommandBehavior.CloseConnection);

                // Build collection of Black products  
                while (await rdr.ReadAsync())
                {
                    tblEmployee.EmployeeId = DataTypeUtils.SaveConvert(rdr["EmployeeID"], "");
                    tblEmployee.EmployeeName = DataTypeUtils.SaveConvert(rdr["EmployeeName"], "");
                    tblEmployee.SyncDate = DataTypeUtils.SaveConvert(rdr["SyncDate"], (DateTime?)null);
                    //tblEmployee.Status = DataTypeUtils.SaveConvert(rdr["Status"], (int?)null);
                    tblEmployee.Del = DataTypeUtils.SaveConvert(rdr["Del"], false);
                }

                rdr.Close();
                return tblEmployee;
            }
            catch (Exception ex)
            {
                var mess = ex.Message;
            }
            return null;
        }
        #endregion


        #region Check In

        private int GetNewStockTransactionID()
        {
            int value = 0;
            DataSet dtset = new DataSet();
            //SqlCommand comm = new SqlCommand("SELECT MAX(STID) AS max FROM tblStockTransaction", objconn);
            SqlCommand comm = new SqlCommand();
            comm.Connection = objconn;
            comm.CommandType = CommandType.StoredProcedure;
            comm.CommandText = "sp_tblStockTransaction_SelectMaxID";
            SqlDataAdapter adapt = new SqlDataAdapter(comm);
            adapt.Fill(dtset);
            if (dtset.Tables[0].Rows.Count > 0)
            {
                DataRow row = dtset.Tables[0].Rows[0];
                if (row["max"] != System.DBNull.Value)
                { value = Convert.ToInt32(row["max"]) + 1; }
                else { value = 1; }
            }
            else { value = 1; }
            return value;
        }

        private int GetNewBinDetailsID()
        {
            int value = 0;
            DataSet dtset = new DataSet();
            //SqlCommand comm = new SqlCommand("SELECT MAX(BinDID) AS max FROM tblBinLocationDetails", objconn);
            SqlCommand comm = new SqlCommand();
            comm.Connection = objconn;
            comm.CommandType = CommandType.StoredProcedure;
            comm.CommandText = "sp_tblBinLocationDetails_SelectMaxID";
            SqlDataAdapter adapt = new SqlDataAdapter(comm);
            adapt.Fill(dtset);
            if (dtset.Tables[0].Rows.Count > 0)
            {
                DataRow row = dtset.Tables[0].Rows[0];
                if (row["max"] != System.DBNull.Value)
                { value = Convert.ToInt32(row["max"]) + 1; }
                else { value = 1; }
            }
            else { value = 1; }
            return value;
        }

        public async Task<bool> CheckInMTS(CheckInPalletDTO request)
        {
            bool _success = true;

            string employeeid = request.EmployeeId;

            DataSet dtset = new DataSet();

            SqlCommand comm3 = new SqlCommand();
            comm3.Connection = objconn;
            comm3.CommandType = CommandType.StoredProcedure;
            comm3.CommandText = "USP_UpdToCommonLocationScanInTime";
            comm3.Parameters.AddWithValue("pallet", request.PalletNo);
            comm3.Parameters.AddWithValue("scanInTime", DateTime.Now);
            comm3.Parameters.AddWithValue("nowloc", request.LocationId);
            comm3.Parameters.AddWithValue("moduleId", GlobalConst.CheckinModule.CheckInStation);
 
            //Exacomm #pending @181018 : GetPalletDetails for transaction record. Can use the same SP no need SP above(commented)
            SqlCommand comm5 = new SqlCommand();
            comm5.Connection = objconn;
            comm5.CommandType = CommandType.StoredProcedure;
            comm5.CommandText = "sp_GetPalletDetails_ByPalletID_PalletComplete";
            comm5.Parameters.AddWithValue("pallet", request.PalletNo);
            comm5.Parameters.AddWithValue("del", false);
            comm5.Parameters.AddWithValue("sts", GlobalConst.StockStatus.Confirm);
            comm5.Parameters.AddWithValue("sts2", GlobalConst.StockStatus.Confirm);
            SqlDataAdapter adapt = new SqlDataAdapter(comm5);
            adapt.Fill(dtset);

            SqlCommand comm4 = new SqlCommand("UPDATE tblStockDetails SET Status=@sts WHERE StockID=@sid AND Del=@del", objconn);
            comm4.Parameters.AddWithValue("sts", GlobalConst.StockStatus.Warehouse);
            comm4.Parameters.AddWithValue("sid", request.StockId);
            comm4.Parameters.AddWithValue("del", false);

            SqlCommand comm7 = new SqlCommand();
            comm7.Connection = objconn;
            comm7.CommandType = CommandType.StoredProcedure;
            comm7.CommandText = "sp_tblStockCartonDetails_UpdateStatus";
            comm7.Parameters.AddWithValue("sts", GlobalConst.StockStatus.Warehouse);
            comm7.Parameters.AddWithValue("sid", request.StockId);
            comm7.Parameters.AddWithValue("del", false);
            comm7.Parameters.AddWithValue("location", request.LocationId);
            comm7.Parameters.AddWithValue("sts_exclude", GlobalConst.StockStatus.Complete);  //08.01.2021: bugs fix. exclude the stock already out to Customer PO. 

            if (dtset.Tables[0].Rows.Count > 0)
            {
                bool _post = false;


                //Connect to AX6 to POST data
                //===================================================================================

                #region AX6 Post data

                //AvaInterfaceContract contract = new AvaInterfaceContract();
                //contract.BatchCardNumber = " "; //Batch Lot No
                //contract.BatchNumber = " "; //Batch serial no
                //contract.BatchSequence = 2; //Need data to check sequence number
                //contract.FunctionID = "STPI";
                //contract.FSIdentifier = Guid.NewGuid();
                //contract.ReferenceBatchNumber1 = txtPalletID.Text; //Pallet ID

                //var TransferJournals = new System.Collections.Generic.List<AVATransferJournalContract>();

                //foreach (DataRow row in dtset.Tables[0].Rows)
                //{
                //    if (row["StockDID"] != System.DBNull.Value)
                //    {
                //        var TransferJournal = new AVATransferJournalContract();
                //        TransferJournal.BatchCardNumber = row["BatchLotNo"].ToString(); //"A13/20170526/S"; //Batch Lot No
                //        TransferJournal.BatchNumber = row["BatchSerialNo"].ToString(); //"2170357415"; //Batch serial no
                //        TransferJournal.Configuration = txtSize.Text; //"S"; //Size
                //        TransferJournal.Warehouse = cbxWarehouse.SelectedValue; //"P2-TP"; //From sample: P1-TP    --- Temp pack warehouse
                //        TransferJournal.Location = TransferJournal.Warehouse;
                //        TransferJournal.ToWarehouse = ""; // not in use any more
                //        TransferJournal.Quantity = Convert.ToDecimal(row["Capacity"]);
                //        TransferJournal.ItemNumber = txtGlove.Text; //"PN-NB-AB-PF-35-SE-VBLU"; //Glove type
                //        TransferJournal.ScanInDateTime = DateTime.Now;
                //        TransferJournals.Add(TransferJournal);
                //    }
                //}
                //contract.TransferJournals = TransferJournals.ToArray();

                //var _call = new CallContext();

                //try
                //{
                //    GlobalConst.OpenChannel();

                //    var xReqINVTRAN = new AxInterfaceCreateInvTransJournalsRequest(_call, contract);
                //    AxInterfaceCreateInvTransJournalsResponse responseINVTRAN = GlobalConst._channel.createInvTransJournals(xReqINVTRAN);
                //    var responseArray = responseINVTRAN.response.Split(new string[] { "||" }, StringSplitOptions.RemoveEmptyEntries);

                //    var result = responseArray[0] + ": " + responseArray[1];

                //    if (responseArray[0] == "SUCCESS")
                //    {
                //        GlobalConst.InsertLogTbl(sSysName, sPage, "Post to AX6", "EmployeeID=" + txtEmployeeID.Text + ";PalletID=" + txtPalletID.Text, uid, stationname, GlobalConst.GetClientIP(), ref objconn);
                //        _post = true;
                //    }
                //    else
                //    {
                //        _success = false;
                //        lblmsg.Text = "PalletID: " + txtPalletID.Text + " - " + result;
                //        msgpnl.CssClass = "alert alert-danger";
                //        msgpnl.Visible = true;
                //        ClientScript.RegisterStartupScript(this.GetType(), "myalert", "alert('PalletID: " + txtPalletID.Text + " - " + result + "');", true);
                //        GlobalConst.InsertErrorTbl(sSysName, sPage, lblmsg.Text, uid, stationname, GlobalConst.GetClientIP(), ref objconn);
                //    }


                //}
                //catch (Exception ex)
                //{
                //    _success = false;
                //    //throw new Exception(ex.ToString());
                //    //if (objconn.State == ConnectionState.Open) { objconn.Close(); }
                //    lblmsg.Text = "Error: " + ex.Message.ToString();
                //    msgpnl.CssClass = "alert alert-danger";
                //    msgpnl.Visible = true;
                //    ClientScript.RegisterStartupScript(this.GetType(), "myalert", "alert('" + ex.Message.ToString() + "');", true);
                //    GlobalConst.InsertErrorTbl(sSysName, sPage, lblmsg.Text, uid, stationname, GlobalConst.GetClientIP(), ref objconn);
                //}
                //finally
                //{
                //    GlobalConst.CloseChannel();
                //}

                #endregion

                #region AX6 Post data with sequence
                /* //Exacomm @181017: OBP comment 
                foreach (DataRow row in dtset.Tables[0].Rows)
                {
                    int _sequence_number = GlobalConst.GetSequenceNumber(row["BatchSerialNo"].ToString(), ref objconn);

                    AvaInterfaceContract contract = new AvaInterfaceContract();
                    contract.BatchCardNumber = " "; //Batch Lot No
                    contract.BatchNumber = " "; //Batch serial no
                    contract.BatchSequence = _sequence_number;
                    contract.FunctionID = "STPI";
                    contract.FSIdentifier = Guid.NewGuid();
                    contract.ReferenceBatchNumber1 = txtPalletID.Text; //Pallet ID

                    var TransferJournals = new System.Collections.Generic.List<AVATransferJournalContract>();

                    if (row["StockDID"] != System.DBNull.Value)
                    {
                        var TransferJournal = new AVATransferJournalContract();
                        TransferJournal.BatchCardNumber = row["BatchLotNo"].ToString(); //"A13/20170526/S"; //Batch Lot No
                        TransferJournal.BatchNumber = row["BatchSerialNo"].ToString(); //"2170357415"; //Batch serial no
                        TransferJournal.Configuration = txtSize.Text; //"S"; //Size
                        TransferJournal.Warehouse = cbxWarehouse.SelectedValue; //"P2-TP"; //From sample: P1-TP    --- Temp pack warehouse
                        TransferJournal.Location = TransferJournal.Warehouse;
                        TransferJournal.ToWarehouse = ""; // not in use any more
                        TransferJournal.Quantity = Convert.ToDecimal(row["Capacity"]);
                        TransferJournal.ItemNumber = txtGlove.Text; //"PN-NB-AB-PF-35-SE-VBLU"; //Glove type
                        TransferJournal.ScanInDateTime = DateTime.Now;
                        TransferJournals.Add(TransferJournal);
                    }
                    contract.TransferJournals = TransferJournals.ToArray();

                    var _call = new CallContext();

                    try
                    {
                        GlobalConst.OpenChannel();

                        var xReqINVTRAN = new AxInterfaceCreateInvTransJournalsRequest(_call, contract);
                        AxInterfaceCreateInvTransJournalsResponse responseINVTRAN = GlobalConst._channel.createInvTransJournals(xReqINVTRAN);
                        var responseArray = responseINVTRAN.response.Split(new string[] { "||" }, StringSplitOptions.RemoveEmptyEntries);

                        var result = responseArray[0] + ": " + responseArray[1];

                        if (responseArray[0] == "SUCCESS")
                        {
                            GlobalConst.InsertLogTbl(sSysName, sPage, "Post to AX6", "EmployeeID=" + txtEmployeeID.Text + ";PalletID=" + txtPalletID.Text, uid, stationname, GlobalConst.GetClientIP(), ref objconn);

                            GlobalConst.InsertAXPostingLog("STPI", "TOMSScanIn", row["BatchLotNo"].ToString(), row["BatchSerialNo"].ToString(), 0, 0, "PT", ref objconn);
                            _post = true;
                        }
                        else
                        {
                            _success = false;
                            lblmsg.Text = "PalletID: " + txtPalletID.Text + " - " + result;
                            msgpnl.CssClass = "alert alert-danger";
                            msgpnl.Visible = true;
                            ClientScript.RegisterStartupScript(this.GetType(), "myalert", "alert('PalletID: " + txtPalletID.Text + " - " + result + "');", true);
                            GlobalConst.InsertErrorTbl(sSysName, sPage, lblmsg.Text, uid, stationname, GlobalConst.GetClientIP(), ref objconn);
                        }


                    }
                    catch (Exception ex)
                    {
                        _success = false;
                        //throw new Exception(ex.ToString());
                        //if (objconn.State == ConnectionState.Open) { objconn.Close(); }
                        lblmsg.Text = "AX Error: " + ex.Message.ToString();
                        msgpnl.CssClass = "alert alert-danger";
                        msgpnl.Visible = true;
                        ClientScript.RegisterStartupScript(this.GetType(), "myalert", "alert('" + ex.Message.ToString() + "');", true);
                        GlobalConst.InsertErrorTbl(sSysName, sPage, lblmsg.Text, uid, stationname, GlobalConst.GetClientIP(), ref objconn);
                    }
                    finally
                    {
                        GlobalConst.CloseChannel();
                    }

                }
                */
                #endregion

                //===================================================================================
                //Close Connect to AX6 to POST data

                _post = true; //bypass AX6 Post Data

                if (_post)
                {
                    try
                    {
                        objconn.Open();
                        //comm.ExecuteNonQuery();
                        //comm2.ExecuteNonQuery();
                        await comm3.ExecuteReaderAsync();
                        await comm4.ExecuteReaderAsync();
                        //comm6.ExecuteNonQuery();

                        //Modified by Tan Wei Wah on 22 May 2017
                        await comm7.ExecuteReaderAsync();
                        //End Modified by Tan Wei Wah

                        //foreach (DataRow row in dtset.Tables[0].Rows)
                        //{
                        //    if (row["StockDID"] != System.DBNull.Value)
                        //    {
                        //        //SqlCommand comm = new SqlCommand("INSERT INTO tblStockTransaction (STID,TransactionType,LocationID,BinID,CreatedDate,Status,StockID,UserID,StationName,Del,EmployeeID) VALUES (@stid,@typ,@locid,@bin,@dt,@sts,@sid,@uid,@station,@del,@employee)", objconn);
                        //        SqlCommand comm = new SqlCommand();
                        //        comm.Connection = objconn;
                        //        comm.CommandType = CommandType.StoredProcedure;
                        //        comm.CommandText = "sp_tblStockTransaction_Insert_Carton";
                        //        comm.Parameters.AddWithValue("stid", GetNewStockTransactionID());
                        //        comm.Parameters.AddWithValue("typ", GlobalConst.StockTransactionType.ScanIn);
                        //        comm.Parameters.AddWithValue("locid", locid);
                        //        comm.Parameters.AddWithValue("bin", binid);
                        //        comm.Parameters.AddWithValue("dt", DateTime.Now);
                        //        comm.Parameters.AddWithValue("sts", GlobalConst.Status.Active);
                        //        comm.Parameters.AddWithValue("sid", request.StockId);
                        //        comm.Parameters.AddWithValue("uid", request.UserId);
                        //        comm.Parameters.AddWithValue("station", request.StationName);
                        //        comm.Parameters.AddWithValue("del", false);
                        //        comm.Parameters.AddWithValue("employee", employeeid);
                        //        comm.Parameters.AddWithValue("sdid", Convert.ToInt32(row["StockDID"]));
                        //        comm.Parameters.AddWithValue("cartonid", row["CartonID"].ToString());  //want to use StockCID or CartonID?
                        //        comm.Parameters.AddWithValue("cartoncapacity", Convert.ToInt32(row["CartonCapacity"]));
                        //        comm.Parameters.AddWithValue("forecastWO", row["ForecastWO"].ToString());
                        //        comm.Parameters.AddWithValue("forecastSO", row["ForecastSO"].ToString());
                        //        comm.Parameters.AddWithValue("actualWO", "");
                        //        comm.Parameters.AddWithValue("actualSO", "");
                        //        comm.ExecuteNonQuery();
                        //    }
                        //}
                        objconn.Close();
                        InsertLogTbl("WMS-OBP", "Warehouse - Check In Station", "Check In Station", "EmployeeID=" + request.EmployeeId + ";PalletID=" + request.PalletNo, 1, request.StationName, request.MachineIP, ref objconn);


                        string _log = string.Format("EmpID:{0},CartonID:{1},BinLocation:{2},Warehouse:{3}", request.EmployeeId, GetBatchList(request.StockId.ToString()), request.BinLocationId, request.LocationName);
                        InsertAuditLog(request.StationName, "Check In Station", "New", request.PalletNo, _log, 1, ref objconn);
                    }
                    catch (Exception ex)
                    {
                        _success = false;
                    }
                }
            }


            //Prepare to print TFTP Slip, Call the printing function and pass parameter @stockID


            return _success;
        }

        public static DataSet InsertLogTbl(string pSystemName, string pPage, string pAction, string pDetails, int pUserID, string pStationName, string pIPAddress, ref SqlConnection objconn)
        {

            DataSet dtset = new DataSet();
            SqlCommand comm = new SqlCommand();
            comm.Connection = objconn;
            comm.CommandType = CommandType.StoredProcedure;

            comm.CommandText = "usp_InsertTblSysLog";
            comm.Parameters.AddWithValue("@LogDateTime", SqlDbType.DateTime).Value = DateTime.Now;
            comm.Parameters.AddWithValue("@SystemName", pSystemName);
            comm.Parameters.AddWithValue("@Page", pPage);
            comm.Parameters.AddWithValue("@Action", pAction);
            comm.Parameters.AddWithValue("@Details", pDetails);
            comm.Parameters.AddWithValue("@UserID", pUserID);
            comm.Parameters.AddWithValue("@StationName", pStationName);
            comm.Parameters.AddWithValue("@IPAddress", pIPAddress);

            SqlDataAdapter adapt = new SqlDataAdapter(comm);
            adapt.Fill(dtset);

            return dtset;
        }
        public static DataSet InsertAuditLog(string aWorkstation, string aModule, string aType, string aSerialNo, string aDescription, int aUserID, ref SqlConnection objconn)
        {

            DataSet dtset = new DataSet();
            SqlCommand comm = new SqlCommand();
            comm.Connection = objconn;
            comm.CommandType = CommandType.StoredProcedure;

            comm.CommandText = "usp_InsertTblAuditLog";
            comm.Parameters.AddWithValue("@Workstation", aWorkstation);
            comm.Parameters.AddWithValue("@Module", aModule);
            comm.Parameters.AddWithValue("@Type", aType);
            comm.Parameters.AddWithValue("@SerialNo", aSerialNo);
            //comm.Parameters.AddWithValue("@LotNo", aLotNo);
            //comm.Parameters.AddWithValue("@CartonNo", aCartonNo);
            comm.Parameters.AddWithValue("@Description", aDescription);
            comm.Parameters.AddWithValue("@CreatedOn", SqlDbType.DateTime).Value = DateTime.Now;
            comm.Parameters.AddWithValue("@CreatedBy", aUserID);

            SqlDataAdapter adapt = new SqlDataAdapter(comm);
            adapt.Fill(dtset);

            return dtset;
        }

        private string GetBatchList(string stockID)
        {
            string _list = "";

            DataSet dtset = new DataSet();
            //SqlCommand comm = new SqlCommand("SELECT BatchSerialNo, CartonQty FROM tblStockDetails WHERE StockID=@sid AND Del=@del", objconn);

            //Exacomm @181017:OBP - Change to track CartonID instead of BatchSerialNo
            SqlCommand comm = new SqlCommand("SELECT CartonID FROM tblStockCartonDetails WHERE StockID=@sid AND Del=@del", objconn);
            comm.Parameters.AddWithValue("sid", stockID);
            comm.Parameters.AddWithValue("del", false);
            //comm.Parameters.AddWithValue("sts", GblRef.StockStatus.Confirm); //need to filter out those that have only registered but not completed yet.
            SqlDataAdapter adapt = new SqlDataAdapter(comm);
            adapt.Fill(dtset);
            //dtmain = dtset;
            if (dtset.Tables[0].Rows.Count > 0)
            {
                int q = 0;
                if (dtset.Tables[0].Rows[q]["CartonID"] != System.DBNull.Value)
                {
                    _list += dtset.Tables[0].Rows[q]["CartonID"].ToString();
                }
                for (q = 1; q < dtset.Tables[0].Rows.Count; q++)
                {
                    if (dtset.Tables[0].Rows[q]["CartonID"] != System.DBNull.Value)
                    { _list += " | " + dtset.Tables[0].Rows[q]["CartonID"].ToString(); }
                }
            }

            return _list;
        }
        #endregion
    }
}
