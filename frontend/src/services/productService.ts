import {Product} from '../utils/types';

interface ApiVariant {id:number;type:'SIZE'|'COLOR'|'FITTING';code:string;name:string;dimensions?:string;colorHex?:string;priceAdjustment:number;stockQuantity:number}
interface ApiProduct {id:number;name:string;categoryName:string;shortDescription:string;roomSpace?:string;basePrice:number;stockQuantity:number;recycledWasteAmount?:string;imageUrls:string[];variants:ApiVariant[]}

export async function fetchActiveProducts():Promise<Product[]>{
  const response=await fetch('/api/products');
  if(!response.ok)throw new Error('Không thể tải danh sách sản phẩm');
  const data=await response.json() as ApiProduct[];
  return data.map(mapProduct);
}

function mapProduct(p:ApiProduct):Product{
  const sizes=p.variants.filter(v=>v.type==='SIZE').map(v=>({id:String(v.id),label:v.name,dimensions:v.dimensions||v.name,price:Number(p.basePrice)+Number(v.priceAdjustment)}));
  const colors=p.variants.filter(v=>v.type==='COLOR').map(v=>({id:String(v.id),label:v.name,hex:v.colorHex||'#8a572c'}));
  const fittings=p.variants.filter(v=>v.type==='FITTING').map(v=>({id:String(v.id),label:v.name,priceDelta:Number(v.priceAdjustment)}));
  return {id:String(p.id),name:p.name,category:p.categoryName,roomSpace:p.roomSpace||'Không gian sống',price:Number(p.basePrice),rating:0,reviewCount:0,shortDesc:p.shortDescription,story:p.shortDescription,specs:{material:'Vật liệu tái chế',dimensions:sizes[0]?.dimensions||'Theo thiết kế',weight:'Đang cập nhật',recycledWasteAmount:p.recycledWasteAmount||'Đang cập nhật',finish:'Thủ công',origin:'Nhà Mình'},careGuide:['Để nơi khô ráo','Lau nhẹ bằng khăn mềm'],images:p.imageUrls?.length?p.imageUrls:['/logo-emblem.png'],sizes:sizes.length?sizes:[{id:'default',label:'Tiêu chuẩn',dimensions:'Tiêu chuẩn',price:Number(p.basePrice)}],waxTones:colors.length?colors:[{id:'natural',label:'Màu tự nhiên',hex:'#b89063'}],fittingOptions:fittings.length?fittings:[{id:'default',label:'Tiêu chuẩn',priceDelta:0}],inStock:p.stockQuantity>0};
}
