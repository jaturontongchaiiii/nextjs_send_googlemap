import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';

@Controller('googlemap')
export class GooglemapController {
    // ตั้งค่า endpoint เป็น Post
    @Post()
    // รับค่า parameter 3 ค่า address type radius
    sendGoogleMap(@Body("address") address:string, @Body("type") type:string, @Body("radius") radius:number) {
      return getLatLng(address, type, radius); 
    }
}
const apiKey = 'YOUR_API_KEY';
var caches_array = [];

async function getLatLng(address:string, type:string, radius:number) {
    // ตรวจสอบว่ามี caches การค้นหาก่อนหน้านี้หรือป่าว
    const caches = new Caches();
    var result = caches.Search(address, type);
    if (result == false) {
        // https://developers.google.com/maps/documentation/geocoding/start
        // นำ address ไปค้นหา lat lng
        const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
        const params = {
          address,
          key: apiKey,
        };
        try {
          const response = await axios.get(baseUrl, { params });
          const data = response.data;
          if (data.status === 'OK') {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            // var ifram:any = `https://maps.google.com/maps?q='${lat},${lng}'&hl=es;z14&output=embed`;
            // นำ lat lng ที่ได้ไปค้นหาสถานที่ใกล้เคียงจาก type
            var array:any = await getLocationNear(lat, lng, type, radius);
                array = setArray(array);
                // เก็บข้อมูลไว้ใน caches
                caches.Push(lat, lng, address, type, array);
            // return caches ที่เก็บ
            return caches.Search(address, type);
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
    } else {
      return result;
    }
}

// ค้นหาจสถานที่ใกล้เคียงจาก lat lng
async function getLocationNear(lat:any, lng:any, type:string, radius:number) {
    // https://developers.google.com/maps/documentation/places/web-service/search-nearby#maps_http_places_nearbysearch-txt
    var res;
    const baseUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}`;
    const params = {
      // location: lat+'%2C'+lng,
      type: type,
      radius: radius,
      keyword: type,
      key: apiKey,
    };
    try {
      const response = await axios.get(baseUrl, { params });
      const data = response.data;
      if (data.status === 'OK') {
        res = response.data.results;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }

    return res;
}

// เก็บข้อมูลเฉพาะที่ต้องการ
function setArray(array) {
  var results = [];
  
  for (var i = 0 ; i < array.length ; i++) {
    let body = {
      label: array[i].name,
      position: array[i].geometry.location,
    }
    results.push(body);
  }
  
  return results;
}

// Class Caches ค้นหาข้อมูล เก็บข้อมูล และ ล้างข้อมูล
class Caches {
  constructor() {}

  // ค้นหาข้อมูล
  Search(address_s, type_s) {
    const index = caches_array.findIndex(({address , type}) => address === address_s && type === type_s);
    if (index != -1) {
      var timestamp_now = + new Date() - (1000 * 60 * 60 * 8);
      // เช็คเวลาถ้าหากข้อมูลนั้นเป็นข้อมูลเก่าเกิน 8 ชั่วโมง หรือไม่
      if (caches_array[index].timestamp < timestamp_now) {
        // ถ้าเกิน 8 ชั่วโมงให้ลบข้อมูลนั้นออก
        this.Clear_caches(index);
        return false;
      } else {
        // ถ้าไม่เกิน 8 ชั่วโมงให้เรียกข้อมูลเดิมให้กับ client
        return caches_array[index];
      }
    } else {
      return false;
    }
  }

  // เก็บข้อมูลเป็น object
  Push(lat, lng, address, type, array) {
    caches_array.push(
      {
        lat: lat,
        lng: lng,
        address: address,
        type: type,
        array: array,
        timestamp: +new Date(),
      }
    )
  }

  // clear caches
  Clear_caches(index) {
    caches_array.splice(index, 1);
  }
}

// (async () => {
//     const latLng = await getLatLng('1600 Amphitheatre Parkway, Mountain View, CA');
//     if (latLng) {
//       console.log(`Latitude: ${latLng.lat}, Longitude: ${latLng.lng}`);
//     }
// })();