import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconeComponent } from '../icone/icone.component';
import { DadosProduto, Produto } from '../../modelos/produto.modelo';
import { ProdutoServico } from '../../servicos/produto.servico';
import { mensagemDeErro } from '../../utilitarios/mensagem-de-erro';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAXIMO_EM_BYTES = 1.5 * 1024 * 1024;

@Component({
  selector: 'app-produto-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconeComponent],
  templateUrl: './produto-formulario.component.html',
  styleUrls: ['./produto-formulario.component.css'],
})
export class ProdutoFormularioComponent implements OnInit {
  /** Produto a editar; nulo quando é um novo cadastro. */
  @Input() produto: Produto | null = null;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  categorias = ['Maquiagem', 'Skin care', 'Perfumaria'];
  formulario = this.construtor.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    preco: ['', [Validators.required, Validators.pattern(/^\d+([.,]\d{1,2})?$/)]],
    categoria: ['Maquiagem', Validators.required],
  });
  imagemEscolhida: File | null = null;
  previa: string | null = null;
  salvando = false;
  erro = '';

  constructor(private construtor: FormBuilder, private produtoServico: ProdutoServico) {}

  get editando(): boolean {
    return this.produto !== null;
  }

  ngOnInit(): void {
    if (!this.produto) return;
    this.formulario.patchValue({
      nome: this.produto.nome,
      preco: this.produto.preco.toFixed(2).replace('.', ','),
      categoria: this.produto.categoria,
    });
    this.previa = this.produto.imagem;
  }

  @HostListener('document:keydown.escape')
  cancelar(): void {
    if (!this.salvando) this.cancelado.emit();
  }

  escolherImagem(evento: Event): void {
    const arquivo = (evento.target as HTMLInputElement).files?.[0];
    if (!arquivo) return;

    if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
      this.erro = 'Envie uma imagem JPG, PNG ou WEBP.';
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO_EM_BYTES) {
      this.erro = 'A imagem deve ter no máximo 1,5 MB.';
      return;
    }

    this.erro = '';
    this.imagemEscolhida = arquivo;
    const leitor = new FileReader();
    leitor.onload = () => (this.previa = leitor.result as string);
    leitor.readAsDataURL(arquivo);
  }

  salvar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    if (!this.editando && !this.imagemEscolhida) {
      this.erro = 'Escolha uma foto para o produto.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    const requisicao = this.produto
      ? this.produtoServico.atualizar(this.produto.id, this.montarDados())
      : this.produtoServico.criar(this.montarDados());

    requisicao.subscribe({
      next: () => this.salvo.emit(),
      error: (erro) => {
        this.erro = mensagemDeErro(erro, 'Não foi possível salvar o produto.');
        this.salvando = false;
      },
    });
  }

  private montarDados(): DadosProduto {
    const { nome, preco, categoria } = this.formulario.getRawValue();
    return {
      nome: nome.trim(),
      preco: Number(preco.replace(',', '.')),
      categoria,
      imagem: this.imagemEscolhida,
    };
  }
}
